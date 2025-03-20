import { atom } from 'jotai';
import { useGitHubStore } from './githubStore';
import type { GitHubBranch, GitHubCommit, GitHubIssue, GitHubPullRequest, GitHubRepository } from './types';

// UI State Atoms
export const githubImportModalAtom = atom(
  (get) => get(useGitHubStore).showImportModal,
  (get, set, show: boolean) => set(useGitHubStore, { showImportModal: show })
);

export const githubProfileDialogAtom = atom(
  (get) => get(useGitHubStore).showProfileDialog,
  (get, set, show: boolean) => set(useGitHubStore, { showProfileDialog: show })
);

export const githubConnectDialogAtom = atom(
  (get) => get(useGitHubStore).showConnectDialog,
  (get, set, show: boolean) => set(useGitHubStore, { showConnectDialog: show })
);

export const githubDisconnectDialogAtom = atom(
  (get) => get(useGitHubStore).showDisconnectDialog,
  (get, set, show: boolean) => set(useGitHubStore, { showDisconnectDialog: show })
);

export const githubAccountSwitcherAtom = atom(
  (get) => get(useGitHubStore).showAccountSwitcher,
  (get, set, show: boolean) => set(useGitHubStore, { showAccountSwitcher: show })
);

// Data Atoms
export const githubRepositoriesAtom = atom(
  (get) => get(useGitHubStore).repositories,
  (get, set, repositories: GitHubRepository[]) => set(useGitHubStore, { repositories })
);

export const selectedRepositoryAtom = atom(
  (get) => get(useGitHubStore).selectedRepository,
  (get, set, repository: GitHubRepository | null) => set(useGitHubStore, { selectedRepository: repository })
);

export const githubBranchesAtom = atom(
  (get) => get(useGitHubStore).branches,
  (get, set, branches: Record<string, GitHubBranch[]>) => set(useGitHubStore, { branches })
);

export const githubCommitsAtom = atom(
  (get) => get(useGitHubStore).commits,
  (get, set, commits: Record<string, GitHubCommit[]>) => set(useGitHubStore, { commits })
);

export const githubIssuesAtom = atom(
  (get) => get(useGitHubStore).issues,
  (get, set, issues: Record<string, GitHubIssue[]>) => set(useGitHubStore, { issues })
);

export const githubPullRequestsAtom = atom(
  (get) => get(useGitHubStore).pullRequests,
  (get, set, pullRequests: Record<string, GitHubPullRequest[]>) => set(useGitHubStore, { pullRequests })
);

// Derived Atoms
export const githubSyncStatusAtom = atom((get) => {
  const store = get(useGitHubStore);
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

export const githubConnectionStatusAtom = atom((get) => {
  const store = get(useGitHubStore);
  return {
    isConnected: store.isConnected,
    isLoading: store.isLoading,
    error: store.error,
    currentUser: store.currentUser,
    linkedAccounts: store.linkedAccounts,
  };
});
