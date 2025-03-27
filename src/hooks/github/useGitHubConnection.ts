import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { logger } from '@/services/chat/LoggingService';

export type GitHubConnectionStatus = 'connected' | 'disconnected' | 'pending' | 'error';

interface GitHubConnectionData {
  username?: string;
  avatarUrl?: string;
  [key: string]: unknown;
}

export function useGitHubConnection() {
  const [isConnected, setIsConnected] = useState(false);
  const [isChecking, setIsChecking] = useState(true);
  const [connectionStatus, setConnectionStatus] = useState<GitHubConnectionStatus>('pending');
  const [githubUsername, setGithubUsername] = useState<string>('');

  const checkConnectionStatus = async () => {
    try {
      setIsChecking(true);
      setConnectionStatus('pending');

      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        setConnectionStatus('disconnected');
        setIsConnected(false);
        return;
      }

      const { data: connection, error } = await supabase
        .from('github_connections')
        .select('*')
        .eq('user_id', user.id)
        .single();

      if (error) {
        setConnectionStatus('error');
        setIsConnected(false);
        return;
      }

      if (connection) {
        setConnectionStatus('connected');
        setIsConnected(true);
        setGithubUsername(connection.username || '');
      } else {
        setConnectionStatus('disconnected');
        setIsConnected(false);
      }
    } catch (error) {
      logger.error('Error checking GitHub connection:', error);
      setConnectionStatus('error');
      setIsConnected(false);
    } finally {
      setIsChecking(false);
    }
  };

  useEffect(() => {
    checkConnectionStatus();
  }, []);

  const connectGitHub = async () => {
    try {
      setConnectionStatus('pending');
      // TODO: Implement GitHub OAuth flow
      setConnectionStatus('connected');
      setIsConnected(true);
    } catch (error) {
      logger.error('Error connecting to GitHub:', error);
      setConnectionStatus('error');
      setIsConnected(false);
    }
  };

  const disconnectGitHub = async () => {
    try {
      setConnectionStatus('pending');
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('User not authenticated');

      const { error } = await supabase
        .from('github_connections')
        .delete()
        .eq('user_id', user.id);

      if (error) throw error;

      setConnectionStatus('disconnected');
      setIsConnected(false);
      setGithubUsername('');
    } catch (error) {
      logger.error('Error disconnecting from GitHub:', error);
      setConnectionStatus('error');
    }
  };

  const refreshConnection = async () => {
    await checkConnectionStatus();
  };

  return {
    isConnected,
    isChecking,
    connectionStatus,
    githubUsername,
    connectGitHub,
    disconnectGitHub,
    refreshConnection,
    checkConnectionStatus
  };
}
