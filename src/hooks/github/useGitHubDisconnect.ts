import { useGitHubStore } from '@/stores/features/github';

export function useGitHubDisconnect() {
  const { disconnect: disconnectGitHub } = useGitHubStore();

  return {
    disconnectGitHub
  };
}
