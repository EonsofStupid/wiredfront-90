
import { useState } from 'react';

interface GitHubConnectionState {
  isAuthenticated: boolean;
  isConnecting: boolean;
  error: Error | null;
  username: string | null;
}

export function useGitHubConnection() {
  const [state, setState] = useState<GitHubConnectionState>({
    isAuthenticated: false,
    isConnecting: false,
    error: null,
    username: null
  });

  const connect = async () => {
    setState(prev => ({ ...prev, isConnecting: true }));
    
    try {
      // Placeholder for actual GitHub connection logic
      setState({
        isAuthenticated: true,
        isConnecting: false,
        error: null,
        username: 'github-user'
      });
      return true;
    } catch (error) {
      setState({
        isAuthenticated: false,
        isConnecting: false,
        error: error instanceof Error ? error : new Error('Unknown error'),
        username: null
      });
      return false;
    }
  };

  const disconnect = async () => {
    setState({
      isAuthenticated: false,
      isConnecting: false,
      error: null,
      username: null
    });
    return true;
  };

  return {
    ...state,
    connect,
    disconnect
  };
}
