import { useGitHubStore } from '@/stores/features/github';

export function useGitHubTokenValidation() {
  const { isConnected, isLoading, error, checkConnection } = useGitHubStore();

  return {
    isConnected,
    isLoading,
    error,
    checkConnection
  };
}
