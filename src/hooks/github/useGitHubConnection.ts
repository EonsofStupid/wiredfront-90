
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { useGitHubConnect } from "./useGitHubConnect";
import { useGitHubOAuthCallback } from "./useGitHubOAuthCallback";
import { logger } from "@/services/chat/LoggingService";
import { GitHubConnectionState } from "@/types/admin/settings/github";
import { useSessionStore } from "@/stores/session/store";

export function useGitHubConnection() {
  const [isConnected, setIsConnected] = useState<boolean>(false);
  const [username, setUsername] = useState<string | null>(null);
  const [connectionStatus, setConnectionStatus] = useState<GitHubConnectionState>('idle');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [debugInfo, setDebugInfo] = useState<Record<string, any> | null>(null);
  const [isCheckingConnection, setIsCheckingConnection] = useState<boolean>(false);
  const { user } = useSessionStore();

  // Setup GitHub Connect functionality
  const { connect, isInitializing } = useGitHubConnect({
    setConnectionStatus,
    setErrorMessage,
    setDebugInfo
  });

  // Setup callback handling
  useGitHubOAuthCallback({
    setConnectionStatus,
    setErrorMessage,
    setUsername,
    checkConnection,
    setIsCheckingConnection
  });

  // Function to check the current connection status
  async function checkConnection() {
    if (!user) {
      setIsConnected(false);
      setUsername(null);
      return;
    }

    setIsCheckingConnection(true);
    try {
      logger.info('Checking GitHub connection status');
      
      // First check if we have an oauth_connection entry
      const { data: connection, error } = await supabase
        .from('oauth_connections')
        .select('*')
        .eq('user_id', user.id)
        .eq('provider', 'github')
        .maybeSingle();
      
      if (error) {
        throw error;
      }
      
      if (connection) {
        setIsConnected(true);
        setUsername(connection.account_username || null);
        setConnectionStatus('connected');
        logger.info('GitHub connection found', { username: connection.account_username });
        return;
      }
      
      // If no connection found, check if there's a status entry
      const { data: statusData, error: statusError } = await supabase
        .from('github_connection_status')
        .select('*')
        .eq('user_id', user.id)
        .maybeSingle();
      
      if (statusError) {
        throw statusError;
      }
      
      if (statusData && statusData.status === 'connected' && statusData.metadata?.username) {
        setIsConnected(true);
        setUsername(statusData.metadata.username);
        setConnectionStatus('connected');
        logger.info('GitHub connection status found', { 
          username: statusData.metadata.username,
          status: statusData.status
        });
        return;
      }
      
      // If we get here, no connection exists
      setIsConnected(false);
      setUsername(null);
      setConnectionStatus('idle');
      logger.info('No GitHub connection found');
    } catch (error) {
      logger.error('Error checking GitHub connection:', error);
      setConnectionStatus('error');
      setErrorMessage(`Error checking connection: ${error instanceof Error ? error.message : String(error)}`);
      setIsConnected(false);
    } finally {
      setIsCheckingConnection(false);
    }
  }

  // Function to disconnect GitHub
  async function disconnect() {
    if (!user) return;
    
    setConnectionStatus('connecting');
    try {
      logger.info('Disconnecting GitHub account');
      
      // Delete the OAuth connection
      const { error: deleteError } = await supabase
        .from('oauth_connections')
        .delete()
        .eq('user_id', user.id)
        .eq('provider', 'github');
      
      if (deleteError) {
        throw deleteError;
      }
      
      // Update connection status
      const { error: statusError } = await supabase
        .from('github_connection_status')
        .upsert({
          user_id: user.id,
          status: 'disconnected',
          last_check: new Date().toISOString(),
          metadata: {
            disconnected_at: new Date().toISOString()
          }
        }, {
          onConflict: 'user_id'
        });
      
      if (statusError) {
        throw statusError;
      }
      
      setIsConnected(false);
      setUsername(null);
      setConnectionStatus('idle');
      toast.success('GitHub disconnected successfully');
      
      logger.info('GitHub disconnected successfully');
    } catch (error) {
      logger.error('Error disconnecting GitHub:', error);
      setConnectionStatus('error');
      setErrorMessage(`Error disconnecting: ${error instanceof Error ? error.message : String(error)}`);
      toast.error('Failed to disconnect GitHub');
    }
  }

  // Check connection when component mounts or user changes
  useEffect(() => {
    logger.info('Performing initial GitHub connection check');
    checkConnection();
  }, [user?.id]);

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
