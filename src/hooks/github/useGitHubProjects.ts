import { useGitHubStore } from '@/stores/features/github';

export function useGitHubProjects() {
  const {
    repositories,
    selectedRepository,
    syncStatus,
    isLoading,
    error,
    fetchRepositories,
    selectRepository,
    syncRepository,
    toggleAutoSync
  } = useGitHubStore();

  return {
    repositories,
    selectedRepository,
    syncStatus,
    isLoading,
    error,
    fetchRepositories,
    selectRepository,
    syncRepository,
    toggleAutoSync
  };
}
