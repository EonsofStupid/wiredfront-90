import { useAuthStore } from '@/stores/auth';
import { useGitHubStore } from '@/stores/features/github';
import { useEffect } from 'react';

export function useGitHubConnection() {
  const {
    isConnected,
    isLoading,
    error,
    currentUser,
    linkedAccounts,
    connect: connectGitHub,
    disconnect: disconnectGitHub,
    checkConnection,
    setDefaultAccount: setDefaultGitHubAccount
  } = useGitHubStore();

  const { user } = useAuthStore();

  useEffect(() => {
    if (user?.id) {
      checkConnection();
    }
  }, [user?.id, checkConnection]);

  return {
    isConnected,
    isLoading,
    error,
    githubUsername: currentUser?.login,
    linkedAccounts,
    connectGitHub,
    disconnectGitHub,
    checkConnection,
    setDefaultGitHubAccount
  };
}
