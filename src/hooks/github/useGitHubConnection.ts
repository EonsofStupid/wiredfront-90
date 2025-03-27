
import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { logger } from '@/services/chat/LoggingService';

export type GitHubConnectionStatus = {
  status: 'connected' | 'pending' | 'disconnected' | 'error';
  metadata?: {
    username?: string;
    avatarUrl?: string;
    [key: string]: any;
  } | null;
  errorMessage?: string | null;
};

export function useGitHubConnection() {
  const [isConnected, setIsConnected] = useState(false);
  const [isChecking, setIsChecking] = useState(true);
  const [connectionStatus, setConnectionStatus] = useState<GitHubConnectionStatus>({
    status: 'disconnected'
  });
  const [githubUsername, setGithubUsername] = useState<string | null>(null);

  // Check GitHub connection status
  const checkConnection = useCallback(async () => {
    try {
      setIsChecking(true);
      
      const { data, error } = await supabase
        .from('github_connection_status')
        .select('*')
        .eq('is_default', true)
        .single();
      
      if (error) throw error;
      
      if (data) {
        const isConnected = data.status === 'connected';
        setIsConnected(isConnected);
        setConnectionStatus({
          status: data.status,
          metadata: data.metadata,
          errorMessage: data.error_message
        });
        
        if (data.metadata?.username) {
          setGithubUsername(data.metadata.username);
        }
      } else {
        setIsConnected(false);
        setConnectionStatus({ status: 'disconnected' });
      }
    } catch (error) {
      logger.error('Error checking GitHub connection:', error);
      setIsConnected(false);
      setConnectionStatus({ 
        status: 'error',
        errorMessage: 'Failed to check GitHub connection status'
      });
    } finally {
      setIsChecking(false);
    }
  }, []);

  // Connect to GitHub
  const connectGitHub = useCallback(async () => {
    try {
      setConnectionStatus({ status: 'pending' });
      
      // This would actually redirect to GitHub OAuth flow
      // Here we just simulate a pending state for demo
      logger.info('Connecting to GitHub...');
      
      // In real implementation, this would be handled by the OAuth callback
      setTimeout(() => {
        checkConnection();
      }, 1000);
    } catch (error) {
      logger.error('Error connecting to GitHub:', error);
      setConnectionStatus({ 
        status: 'error', 
        errorMessage: 'Failed to connect to GitHub'
      });
    }
  }, [checkConnection]);

  // Disconnect from GitHub
  const disconnectGitHub = useCallback(async () => {
    try {
      // Simulate disconnection - in real implementation would revoke token
      logger.info('Disconnecting from GitHub...');
      
      const { error } = await supabase
        .from('github_connection_status')
        .update({ status: 'disconnected', metadata: null })
        .eq('is_default', true);
        
      if (error) throw error;
      
      setIsConnected(false);
      setGithubUsername(null);
      setConnectionStatus({ status: 'disconnected' });
      
      logger.info('Successfully disconnected from GitHub');
    } catch (error) {
      logger.error('Error disconnecting from GitHub:', error);
      setConnectionStatus({ 
        status: 'error', 
        errorMessage: 'Failed to disconnect from GitHub'
      });
    }
  }, []);

  // Check connection on mount
  useEffect(() => {
    checkConnection();
  }, [checkConnection]);

  return {
    isConnected,
    isChecking,
    connectionStatus,
    githubUsername,
    connectGitHub,
    disconnectGitHub,
    refreshConnection: checkConnection
  };
}
