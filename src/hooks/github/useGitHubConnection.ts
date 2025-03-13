
import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuthStore } from '@/stores/auth/store';
import { toast } from 'sonner';
import { logger } from '@/services/chat/LoggingService';

// Define interface for GitHub connection metadata
interface GitHubConnectionMetadata {
  username?: string;
  scopes?: string[];
  connected_at?: string;
  [key: string]: any;
}

// Type guard to check if metadata conforms to GitHubConnectionMetadata
function isGitHubConnectionMetadata(metadata: any): metadata is GitHubConnectionMetadata {
  return metadata && typeof metadata === 'object';
}

export function useGitHubConnection() {
  const { user } = useAuthStore();
  const [isConnected, setIsConnected] = useState(false);
  const [connectionStatus, setConnectionStatus] = useState<'idle' | 'connecting' | 'connected' | 'error'>('idle');
  const [username, setUsername] = useState<string | null>(null);
  const [repoCount, setRepoCount] = useState<number | undefined>(undefined);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isCheckingConnection, setIsCheckingConnection] = useState(true);
  const [authWindow, setAuthWindow] = useState<Window | null>(null);

  // Check if the user is connected to GitHub
  const checkConnection = useCallback(async () => {
    if (!user?.id) {
      setIsCheckingConnection(false);
      setConnectionStatus('idle');
      return;
    }

    setIsCheckingConnection(true);
    try {
      // Check if there's a GitHub connection in the database
      const { data, error } = await supabase
        .from('github_connection_status')
        .select('*')
        .eq('user_id', user.id)
        .single();

      if (error) {
        logger.error('Error checking GitHub connection:', { error: error.message });
        setConnectionStatus('idle');
        return;
      }

      if (data) {
        const isConnectedStatus = data.status === 'connected';
        setIsConnected(isConnectedStatus);
        setConnectionStatus(isConnectedStatus ? 'connected' : data.status === 'error' ? 'error' : 'idle');
        setErrorMessage(data.error_message || null);
        
        // Handle metadata, which could be null, string, or an object
        if (data.metadata) {
          // Safely access username from metadata
          if (isGitHubConnectionMetadata(data.metadata)) {
            setUsername(data.metadata.username || null);
          } else if (typeof data.metadata === 'string') {
            try {
              // Try to parse string metadata as JSON
              const parsedMetadata = JSON.parse(data.metadata);
              if (isGitHubConnectionMetadata(parsedMetadata)) {
                setUsername(parsedMetadata.username || null);
              }
            } catch (e) {
              logger.error('Error parsing metadata string:', { error: e });
            }
          }
        }
      } else {
        setIsConnected(false);
        setConnectionStatus('idle');
      }
    } catch (error) {
      logger.error('Unexpected error checking GitHub connection:', { 
        error: error instanceof Error ? error.message : 'Unknown error' 
      });
      setConnectionStatus('idle');
    } finally {
      setIsCheckingConnection(false);
    }
  }, [user?.id]);

  useEffect(() => {
    checkConnection();
  }, [checkConnection]);

  // Handle auth window message events
  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      // Only handle messages from our auth window
      if (!authWindow || (event.source !== authWindow && event.source !== null)) {
        return;
      }

      const { type, error, username: authUsername, trace_id } = event.data || {};

      if (type === 'github-auth-success') {
        logger.info('GitHub auth success', { username: authUsername, trace_id });
        setConnectionStatus('connected');
        setIsConnected(true);
        setUsername(authUsername);
        setErrorMessage(null);
        toast.success('Successfully connected to GitHub!');
        
        // Close the auth window if it's still open
        if (authWindow && !authWindow.closed) {
          authWindow.close();
        }
        
        // Refresh connection data
        checkConnection();
      } else if (type === 'github-auth-error') {
        logger.error('GitHub auth error', { error, trace_id });
        setConnectionStatus('error');
        setIsConnected(false);
        setErrorMessage(error || 'Failed to connect to GitHub');
        toast.error(`GitHub Authentication Error: ${error || 'Unknown error'}`);
        
        // Close the auth window if it's still open
        if (authWindow && !authWindow.closed) {
          authWindow.close();
        }
      }
    };

    // Add event listener for messages from the popup
    window.addEventListener('message', handleMessage);
    
    return () => {
      window.removeEventListener('message', handleMessage);
    };
  }, [authWindow, checkConnection]);

  // Initiate the GitHub connection
  const connect = useCallback(async () => {
    if (!user) {
      toast.error('You must be logged in to connect to GitHub');
      return;
    }

    setConnectionStatus('connecting');
    
    try {
      // Use the Supabase callback URL
      const callbackUrl = `${window.location.origin}/github-callback`;
      
      // First check if GitHub OAuth is configured
      const { data: configCheck, error: configError } = await supabase.functions.invoke('github-oauth-init', {
        body: { check_only: true }
      });
      
      if (configError || !configCheck?.clientIdConfigured || !configCheck?.clientSecretConfigured) {
        throw new Error('GitHub OAuth is not properly configured');
      }
      
      // Initialize GitHub OAuth
      const { data, error } = await supabase.functions.invoke('github-oauth-init', {
        body: { redirect_url: callbackUrl }
      });
      
      if (error || !data?.url) {
        throw new Error(error?.message || 'Failed to initialize GitHub OAuth');
      }
      
      // Open GitHub authorization in a popup
      const width = 600;
      const height = 700;
      const left = window.screenX + (window.outerWidth - width) / 2;
      const top = window.screenY + (window.outerHeight - height) / 2;
      
      const authWin = window.open(
        data.url,
        'github-oauth',
        `width=${width},height=${height},left=${left},top=${top},resizable=yes,scrollbars=yes,status=yes`
      );
      
      if (!authWin) {
        throw new Error('Popup was blocked. Please allow popups for this site.');
      }
      
      setAuthWindow(authWin);
      
      // Poll to check if window was closed manually
      const pollTimer = setInterval(() => {
        if (authWin.closed) {
          clearInterval(pollTimer);
          // If still in connecting state, user probably closed the window manually
          if (connectionStatus === 'connecting') {
            setConnectionStatus('idle');
            toast.info('GitHub connection was cancelled');
          }
        }
      }, 500);
      
    } catch (error) {
      logger.error('GitHub connect error:', { 
        error: error instanceof Error ? error.message : 'Unknown error' 
      });
      setConnectionStatus('error');
      setErrorMessage(error instanceof Error ? error.message : 'Failed to connect to GitHub');
      toast.error('GitHub Connection Error: ' + (error instanceof Error ? error.message : 'Unknown error'));
    }
  }, [user, connectionStatus]);

  // Disconnect from GitHub
  const disconnect = useCallback(async () => {
    if (!user?.id) {
      return;
    }

    setConnectionStatus('connecting');
    
    try {
      // Delete the OAuth connection
      const { error: deleteError } = await supabase
        .from('oauth_connections')
        .delete()
        .eq('user_id', user.id)
        .eq('provider', 'github');
      
      if (deleteError) {
        throw new Error(deleteError.message);
      }
      
      // Update the connection status
      await supabase
        .from('github_connection_status')
        .upsert({
          user_id: user.id,
          status: 'idle',
          error_message: null,
          last_check: new Date().toISOString(),
          last_successful_operation: null,
          metadata: {}
        }, {
          onConflict: 'user_id'
        });
      
      setIsConnected(false);
      setConnectionStatus('idle');
      setUsername(null);
      setErrorMessage(null);
      toast.success('Disconnected from GitHub');
    } catch (error) {
      logger.error('GitHub disconnect error:', { 
        error: error instanceof Error ? error.message : 'Unknown error' 
      });
      setConnectionStatus('error');
      setErrorMessage(error instanceof Error ? error.message : 'Failed to disconnect from GitHub');
      toast.error('Error disconnecting from GitHub: ' + (error instanceof Error ? error.message : 'Unknown error'));
    }
  }, [user?.id]);

  return {
    isConnected,
    username,
    repoCount,
    connectionStatus,
    errorMessage,
    isCheckingConnection,
    connect,
    disconnect,
    refreshConnection: checkConnection
  };
}
