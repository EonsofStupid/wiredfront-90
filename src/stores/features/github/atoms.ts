import { atomWithDefault } from 'jotai/utils';
import { useGitHubStore } from './githubStore';
import type { GitHubBranch, GitHubCommit, GitHubIssue, GitHubPullRequest, GitHubRepository, GitHubState } from './types';

// Helper function to get store state
const getStoreState = () => useGitHubStore.getState();

// UI State Atoms
export const githubImportModalAtom = atomWithDefault<boolean>(
  () => getStoreState().showImportModal
);

export const githubProfileDialogAtom = atomWithDefault<boolean>(
  () => getStoreState().showProfileDialog
);

export const githubConnectDialogAtom = atomWithDefault<boolean>(
  () => getStoreState().showConnectDialog
);

export const githubDisconnectDialogAtom = atomWithDefault<boolean>(
  () => getStoreState().showDisconnectDialog
);

export const githubAccountSwitcherAtom = atomWithDefault<boolean>(
  () => getStoreState().showAccountSwitcher
);

// Data Atoms
export const githubRepositoriesAtom = atomWithDefault<GitHubRepository[]>(
  () => getStoreState().repositories
);

export const selectedRepositoryAtom = atomWithDefault<GitHubRepository | null>(
  () => getStoreState().selectedRepository
);

export const githubBranchesAtom = atomWithDefault<Record<string, GitHubBranch[]>>(
  () => getStoreState().branches
);

export const githubCommitsAtom = atomWithDefault<Record<string, GitHubCommit[]>>(
  () => getStoreState().commits
);

export const githubIssuesAtom = atomWithDefault<Record<string, GitHubIssue[]>>(
  () => getStoreState().issues
);

export const githubPullRequestsAtom = atomWithDefault<Record<string, GitHubPullRequest[]>>(
  () => getStoreState().pullRequests
);

// Derived Atoms
export const githubSyncStatusAtom = atomWithDefault<{
  isSyncing: boolean;
  hasError: boolean;
  statuses: GitHubState['syncStatus'];
}>(() => {
  const store = getStoreState();
  return {
    isSyncing: Object.values(store.syncStatus).some(
      (status) => status.status === 'syncing'
    ),
    hasError: Object.values(store.syncStatus).some(
      (status) => status.status === 'error'
    ),
    statuses: store.syncStatus,
  };
});

export const githubConnectionStatusAtom = atomWithDefault<{
  isConnected: boolean;
  isLoading: boolean;
  error: string | null;
  currentUser: GitHubState['currentUser'];
  linkedAccounts: GitHubState['linkedAccounts'];
}>(() => {
  const store = getStoreState();
  return {
    isConnected: store.isConnected,
    isLoading: store.isLoading,
    error: store.error,
    currentUser: store.currentUser,
    linkedAccounts: store.linkedAccounts,
  };
});
