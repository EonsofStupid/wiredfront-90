import { useChatStore } from '@/features/chat/store/chatStore';
import { atom } from 'jotai';
import { useGitHubStore } from './githubStore';

// Helper functions to get store states
const getChatStoreState = () => useChatStore.getState();
const getGitHubStoreState = () => useGitHubStore.getState();

// UI State Atoms - These are now derived from chat store
export const githubImportModalAtom = atom(
  () => getChatStoreState().showSidebar && getChatStoreState().isOpen
);

export const githubProfileDialogAtom = atom(
  () => getChatStoreState().isOpen && !getChatStoreState().isMinimized
);

export const githubConnectDialogAtom = atom(
  () => getChatStoreState().isOpen && !getChatStoreState().isMinimized
);

export const githubDisconnectDialogAtom = atom(
  () => getChatStoreState().isOpen && !getChatStoreState().isMinimized
);

export const githubAccountSwitcherAtom = atom(
  () => getChatStoreState().isOpen && !getChatStoreState().isMinimized
);

// Data Atoms - These remain from GitHub store
export const githubRepositoriesAtom = atom(() => getGitHubStoreState().repositories);

export const selectedRepositoryAtom = atom(() => getGitHubStoreState().selectedRepository);

export const githubBranchesAtom = atom(() => getGitHubStoreState().branches);

export const githubCommitsAtom = atom(() => getGitHubStoreState().commits);

export const githubIssuesAtom = atom(() => getGitHubStoreState().issues);

export const githubPullRequestsAtom = atom(() => getGitHubStoreState().pullRequests);

// Derived Atoms - These combine both stores
export const githubSyncStatusAtom = atom(() => {
  const store = getGitHubStoreState();
  const chatStore = getChatStoreState();

  return {
    isSyncing: Object.values(store.syncStatus).some(
      (status) => status.status === 'syncing'
    ),
    hasError: Object.values(store.syncStatus).some(
      (status) => status.status === 'error'
    ),
    statuses: store.syncStatus,
    isVisible: chatStore.isOpen && !chatStore.isMinimized,
    position: chatStore.position,
    scale: chatStore.scale,
    docked: chatStore.docked
  };
});

export const githubConnectionStatusAtom = atom(() => {
  const store = getGitHubStoreState();
  const chatStore = getChatStoreState();

  return {
    isConnected: store.isConnected,
    isLoading: store.isLoading,
    error: store.error,
    currentUser: store.currentUser,
    linkedAccounts: store.linkedAccounts,
    isVisible: chatStore.isOpen && !chatStore.isMinimized,
    theme: chatStore.themePrefs.theme,
    fontSize: chatStore.themePrefs.fontSize,
    animations: chatStore.themePrefs.animations,
    glowEffects: chatStore.themePrefs.glowEffects,
    transparencyLevel: chatStore.themePrefs.transparencyLevel
  };
});
