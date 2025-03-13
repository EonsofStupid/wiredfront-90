
import { useState, useEffect, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { GitHubOAuthConnection } from "@/types/admin/settings/github";
import { toast } from "sonner";

export function useGitHubConnection() {
  const [isConnected, setIsConnected] = useState<boolean>(false);
  const [username, setUsername] = useState<string | null>(null);
  const [connectionStatus, setConnectionStatus] = useState<'idle' | 'connecting' | 'connected' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isCheckingConnection, setIsCheckingConnection] = useState(true);
  const [debugInfo, setDebugInfo] = useState<any>(null);

  const checkConnection = useCallback(async () => {
    try {
      setIsCheckingConnection(true);
      const { data, error } = await supabase
        .from('oauth_connections')
        .select('*')
        .eq('provider', 'github')
        .single();
        
      if (error) {
        if (error.code !== 'PGRST116') { // Not found error
          console.error('Error checking GitHub connection:', error);
        }
        setIsConnected(false);
        return;
      }
      
      const connection = data as GitHubOAuthConnection;
      setIsConnected(!!connection);
      if (connection && connection.account_username) {
        setUsername(connection.account_username);
      }
    } catch (error) {
      console.error('Error checking GitHub connection:', error);
    } finally {
      setIsCheckingConnection(false);
    }
  }, []);

  useEffect(() => {
    checkConnection();
  }, [checkConnection]);

  useEffect(() => {
    const handleOAuthMessage = (event: MessageEvent) => {
      console.log('Message received from popup:', event.data);
      
      if (event.data && event.data.type === 'github-auth-success') {
        console.log('GitHub auth success message received:', event.data);
        setConnectionStatus('connected');
        setErrorMessage(null);
        
        // Update username if provided in the message
        if (event.data.username) {
          setUsername(event.data.username);
        }
        
        toast.success('Connected to GitHub successfully');
        checkConnection(); // Refresh connection data
      } else if (event.data && event.data.type === 'github-auth-error') {
        console.error('GitHub auth error:', event.data.error);
        setConnectionStatus('error');
        setErrorMessage(event.data.error);
        toast.error(`GitHub connection failed: ${event.data.error}`);
      }
    };

    window.addEventListener('message', handleOAuthMessage);
    return () => window.removeEventListener('message', handleOAuthMessage);
  }, [checkConnection]);

  const connect = async () => {
    try {
      setConnectionStatus('connecting');
      setErrorMessage(null);
      setDebugInfo(null);
      
      // Prepare the callback URL (current origin)
      const callbackUrl = `${window.location.origin}/github-callback`;
      console.log("Using callback URL:", callbackUrl);
      
      // First check if the GitHub client ID is configured
      const { data: configCheck, error: configError } = await supabase.functions.invoke('github-oauth-init', {
        body: { 
          redirect_url: callbackUrl,
          check_only: true
        }
      });
      
      if (configError) {
        console.error('GitHub OAuth configuration error:', configError);
        setErrorMessage(`Configuration error: ${configError.message || configError}`);
        setConnectionStatus('error');
        toast.error(`GitHub configuration error: ${configError.message || configError}`);
        return;
      }
      
      if (configCheck?.error) {
        console.error('GitHub OAuth configuration error:', configCheck.error);
        
        // Save debug info for troubleshooting
        if (configCheck.debug) {
          setDebugInfo(configCheck.debug);
        }
        
        setErrorMessage(configCheck.error);
        setConnectionStatus('error');
        toast.error(`GitHub configuration error: ${configCheck.error}`);
        return;
      }
      
      // If config check passed, call the GitHub OAuth initialization edge function
      const response = await supabase.functions.invoke('github-oauth-init', {
        body: { 
          redirect_url: callbackUrl
        }
      });

      console.log('GitHub OAuth init response:', response);
      
      if (response.error) {
        console.error('Error starting GitHub OAuth flow:', response.error);
        toast.error(`Failed to start GitHub OAuth flow: ${response.error.message || response.error}`);
        setConnectionStatus('error');
        setErrorMessage(response.error.message || response.error);
        return;
      }
      
      const { data } = response;
      
      // Log the URL to help with debugging
      console.log('GitHub OAuth URL generated:', data?.url);
      
      if (!data || !data.url) {
        const errorMsg = data?.error || 'No OAuth URL returned from the server';
        console.error(errorMsg);
        toast.error('Failed to generate GitHub OAuth URL');
        setConnectionStatus('error');
        setErrorMessage(errorMsg);
        return;
      }

      // Open GitHub auth in a popup with precise dimensions
      const width = 600;
      const height = 700;
      const left = window.screenX + (window.outerWidth - width) / 2;
      const top = window.screenY + (window.outerHeight - height) / 2;
      
      console.log('Opening popup with URL:', data.url);
      
      const popup = window.open(
        data.url,
        'Github Authorization',
        `width=${width},height=${height},left=${left},top=${top},status=yes,menubar=no,toolbar=no`
      );
      
      if (!popup || popup.closed || typeof popup.closed === 'undefined') {
        console.error('Popup was blocked or could not be opened');
        toast.error('Popup was blocked. Please allow popups for this site.');
        setConnectionStatus('error');
        setErrorMessage('Popup was blocked. Please allow popups for this site.');
        return;
      }
      
      // Start an interval to check if popup is closed
      const checkPopupClosed = setInterval(() => {
        if (popup.closed) {
          clearInterval(checkPopupClosed);
          // If connection wasn't established when popup closed
          if (connectionStatus === 'connecting') {
            setConnectionStatus('idle');
            toast.error('GitHub connection was cancelled');
          }
        }
      }, 1000);
    } catch (error) {
      console.error('Error connecting to GitHub:', error);
      toast.error('Failed to connect to GitHub');
      setConnectionStatus('error');
      setErrorMessage(error instanceof Error ? error.message : 'Unknown error');
    }
  };

  const disconnect = async () => {
    try {
      setIsCheckingConnection(true);
      const { error } = await supabase
        .from('oauth_connections')
        .delete()
        .eq('provider', 'github');
        
      if (error) throw error;
      
      setIsConnected(false);
      setUsername(null);
      toast.success('Disconnected from GitHub');
    } catch (error) {
      console.error('Error disconnecting from GitHub:', error);
      toast.error('Failed to disconnect from GitHub');
    } finally {
      setIsCheckingConnection(false);
    }
  };

  return {
    isConnected,
    username,
    connectionStatus,
    errorMessage,
    isCheckingConnection,
    debugInfo,
    connect,
    disconnect,
    checkConnection
  };
}
