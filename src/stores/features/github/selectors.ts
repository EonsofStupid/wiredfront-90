import { useGitHubStore } from './githubStore';

// Connection Selectors
export const useGitHubUser = () => useGitHubStore((state) => state.currentUser);
export const useGitHubConnected = () => useGitHubStore((state) => state.isConnected);
export const useGitHubLinkedAccounts = () => useGitHubStore((state) => state.linkedAccounts);
export const useGitHubLoading = () => useGitHubStore((state) => state.isLoading);
export const useGitHubError = () => useGitHubStore((state) => state.error);

// Repository Selectors
export const useGitHubRepositories = () => useGitHubStore((state) => state.repositories);
export const useGitHubSelectedRepository = () => useGitHubStore((state) => state.selectedRepository);

// Data Selectors
export const useGitHubBranches = (repoId: string) =>
  useGitHubStore((state) => state.branches[repoId] || []);

export const useGitHubCommits = (repoId: string) =>
  useGitHubStore((state) => state.commits[repoId] || []);

export const useGitHubIssues = (repoId: string) =>
  useGitHubStore((state) => state.issues[repoId] || []);

export const useGitHubPullRequests = (repoId: string) =>
  useGitHubStore((state) => state.pullRequests[repoId] || []);

// Sync Status Selectors
export const useGitHubSyncStatus = (repoId: string) =>
  useGitHubStore((state) => state.syncStatus[repoId] || {
    status: 'idle',
    lastSynced: null,
    error: null
  });

export const useGitHubIsSyncing = (repoId: string) =>
  useGitHubStore((state) => state.syncStatus[repoId]?.status === 'syncing');

export const useGitHubSyncError = (repoId: string) =>
  useGitHubStore((state) => state.syncStatus[repoId]?.error);

// UI State Selectors
export const useGitHubImportModal = () => useGitHubStore((state) => state.showImportModal);
export const useGitHubProfileDialog = () => useGitHubStore((state) => state.showProfileDialog);
export const useGitHubConnectDialog = () => useGitHubStore((state) => state.showConnectDialog);
export const useGitHubDisconnectDialog = () => useGitHubStore((state) => state.showDisconnectDialog);
export const useGitHubAccountSwitcher = () => useGitHubStore((state) => state.showAccountSwitcher);

// Derived Selectors
export const useGitHubConnectionStatus = () => {
  const isConnected = useGitHubConnected();
  const isLoading = useGitHubLoading();
  const error = useGitHubError();
  const currentUser = useGitHubUser();
  const linkedAccounts = useGitHubLinkedAccounts();

  return {
    isConnected,
    isLoading,
    error,
    currentUser,
    linkedAccounts,
  };
};

export const useGitHubRepositoryData = (repoId: string) => {
  const repository = useGitHubSelectedRepository();
  const branches = useGitHubBranches(repoId);
  const commits = useGitHubCommits(repoId);
  const issues = useGitHubIssues(repoId);
  const pullRequests = useGitHubPullRequests(repoId);
  const syncStatus = useGitHubSyncStatus(repoId);

  return {
    repository,
    branches,
    commits,
    issues,
    pullRequests,
    syncStatus,
  };
};
