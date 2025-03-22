import { atom } from 'jotai';
import { atomWithStorage } from 'jotai/utils';
import { useGitHubStore } from './githubStore';

// Helper function to get store state
const getStoreState = () => useGitHubStore.getState();

// UI State Atoms
export const githubImportModalAtom = atomWithStorage<boolean>('github-import-modal', false);

export const githubProfileDialogAtom = atomWithStorage<boolean>('github-profile-dialog', false);

export const githubConnectDialogAtom = atomWithStorage<boolean>('github-connect-dialog', false);

export const githubDisconnectDialogAtom = atomWithStorage<boolean>('github-disconnect-dialog', false);

export const githubAccountSwitcherAtom = atomWithStorage<boolean>('github-account-switcher', false);

// Data Atoms
export const githubRepositoriesAtom = atom(() => getStoreState().repositories);

export const selectedRepositoryAtom = atom(() => getStoreState().selectedRepository);

export const githubBranchesAtom = atom(() => getStoreState().branches);

export const githubCommitsAtom = atom(() => getStoreState().commits);

export const githubIssuesAtom = atom(() => getStoreState().issues);

export const githubPullRequestsAtom = atom(() => getStoreState().pullRequests);

// Derived Atoms
export const githubSyncStatusAtom = atom(() => {
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

export const githubConnectionStatusAtom = atom(() => {
  const store = getStoreState();
  return {
    isConnected: store.isConnected,
    isLoading: store.isLoading,
    error: store.error,
    currentUser: store.currentUser,
    linkedAccounts: store.linkedAccounts,
  };
});
