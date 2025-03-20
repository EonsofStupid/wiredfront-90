import { supabase } from '@/integrations/supabase/client';
import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';
import { createOAuthActions } from './oauthActions';
const initialState = {
    // Connection State
    isConnected: false,
    isLoading: false,
    error: null,
    // User Data
    currentUser: null,
    linkedAccounts: [],
    // Repository Data
    repositories: [],
    selectedRepository: null,
    branches: {},
    commits: {},
    issues: {},
    pullRequests: {},
    // Sync State
    syncStatus: {},
    // UI State
    showImportModal: false,
    showProfileDialog: false,
    showConnectDialog: false,
    showDisconnectDialog: false,
    showAccountSwitcher: false,
};
export const useGitHubStore = create()(devtools(persist((set, get) => {
    const oauthActions = createOAuthActions(set);
    return {
        ...initialState,
        // Connection Actions
        connect: async () => {
            set({ isLoading: true, error: null });
            try {
                const { data, error } = await supabase.functions.invoke('github-oauth-init', {
                    body: { redirect_url: `${window.location.origin}/github-callback` }
                });
                if (error)
                    throw error;
                if (!data.url)
                    throw new Error('No GitHub authorization URL returned');
                // Open GitHub login in a popup window
                const width = 600;
                const height = 800;
                const left = window.screenX + (window.outerWidth - width) / 2;
                const top = window.screenY + (window.outerHeight - height) / 2;
                const popup = window.open(data.url, 'github-oauth', `width=${width},height=${height},left=${left},top=${top}`);
                if (!popup || popup.closed || typeof popup.closed === 'undefined') {
                    throw new Error('The popup window was blocked. Please allow popups for this site.');
                }
                // Set up OAuth message listener
                const cleanup = oauthActions.setupOAuthListener();
                // Check connection status after a delay
                setTimeout(() => {
                    get().checkConnection();
                    cleanup();
                }, 2000);
            }
            catch (error) {
                set({ error: error instanceof Error ? error.message : 'Failed to connect to GitHub' });
            }
            finally {
                set({ isLoading: false });
            }
        },
        disconnect: async (accountId) => {
            set({ isLoading: true, error: null });
            try {
                const { error } = await supabase.functions.invoke('github-token-management', {
                    body: { action: 'revoke', accountId }
                });
                if (error)
                    throw error;
                set({ isConnected: false, currentUser: null });
            }
            catch (error) {
                set({ error: error instanceof Error ? error.message : 'Failed to disconnect from GitHub' });
            }
            finally {
                set({ isLoading: false });
            }
        },
        setDefaultAccount: async (accountId) => {
            set({ isLoading: true, error: null });
            try {
                const { error } = await supabase
                    .from('oauth_connections')
                    .update({ metadata: { default: true } })
                    .eq('id', accountId);
                if (error)
                    throw error;
                // Reset 'default' for all other accounts
                await supabase
                    .from('oauth_connections')
                    .update({ metadata: { default: false } })
                    .neq('id', accountId);
                // Refresh linked accounts
                get().checkConnection();
            }
            catch (error) {
                set({ error: error instanceof Error ? error.message : 'Failed to set default account' });
            }
            finally {
                set({ isLoading: false });
            }
        },
        checkConnection: async () => {
            set({ isLoading: true, error: null });
            try {
                const { data, error } = await supabase.functions.invoke('github-token-management', {
                    body: { action: 'status' }
                });
                if (error)
                    throw error;
                set({
                    isConnected: data.isConnected,
                    currentUser: data.user || null,
                    linkedAccounts: data.linkedAccounts || [],
                });
            }
            catch (error) {
                set({ error: error instanceof Error ? error.message : 'Failed to check connection status' });
            }
            finally {
                set({ isLoading: false });
            }
        },
        // Repository Actions
        fetchRepositories: async () => {
            set({ isLoading: true, error: null });
            try {
                const { data, error } = await supabase
                    .from('github_repositories')
                    .select('*')
                    .order('created_at', { ascending: false });
                if (error)
                    throw error;
                set({ repositories: data || [] });
            }
            catch (error) {
                set({ error: error instanceof Error ? error.message : 'Failed to fetch repositories' });
            }
            finally {
                set({ isLoading: false });
            }
        },
        selectRepository: (repoId) => {
            const repo = get().repositories.find(r => r.id === repoId);
            set({ selectedRepository: repo || null });
        },
        syncRepository: async (repoId) => {
            set(state => ({
                syncStatus: {
                    ...state.syncStatus,
                    [repoId]: { status: 'syncing', lastSynced: null, error: null }
                }
            }));
            try {
                const { error } = await supabase.functions.invoke('github-repo-management', {
                    body: { action: 'sync-repo', repoId }
                });
                if (error)
                    throw error;
                set(state => ({
                    syncStatus: {
                        ...state.syncStatus,
                        [repoId]: { status: 'success', lastSynced: new Date().toISOString(), error: null }
                    }
                }));
                // Refresh repository data
                get().fetchRepositories();
            }
            catch (error) {
                set(state => ({
                    syncStatus: {
                        ...state.syncStatus,
                        [repoId]: {
                            status: 'error',
                            lastSynced: null,
                            error: error instanceof Error ? error.message : 'Failed to sync repository'
                        }
                    }
                }));
            }
        },
        toggleAutoSync: async (repoId, enabled) => {
            set({ isLoading: true, error: null });
            try {
                const { error } = await supabase
                    .from('github_repositories')
                    .update({ auto_sync: enabled })
                    .eq('id', repoId);
                if (error)
                    throw error;
                // Update local state
                set(state => ({
                    repositories: state.repositories.map(repo => repo.id === repoId ? { ...repo, auto_sync: enabled } : repo)
                }));
            }
            catch (error) {
                set({ error: error instanceof Error ? error.message : 'Failed to update auto-sync setting' });
            }
            finally {
                set({ isLoading: false });
            }
        },
        // Data Actions
        fetchBranches: async (repoId) => {
            set({ isLoading: true, error: null });
            try {
                const { data, error } = await supabase.functions.invoke('github-repo-management', {
                    body: { action: 'fetch-branches', repoId }
                });
                if (error)
                    throw error;
                set(state => ({
                    branches: {
                        ...state.branches,
                        [repoId]: data.branches || []
                    }
                }));
            }
            catch (error) {
                set({ error: error instanceof Error ? error.message : 'Failed to fetch branches' });
            }
            finally {
                set({ isLoading: false });
            }
        },
        fetchCommits: async (repoId, branch) => {
            set({ isLoading: true, error: null });
            try {
                const { data, error } = await supabase.functions.invoke('github-repo-management', {
                    body: { action: 'fetch-commits', repoId, branch }
                });
                if (error)
                    throw error;
                set(state => ({
                    commits: {
                        ...state.commits,
                        [repoId]: data.commits || []
                    }
                }));
            }
            catch (error) {
                set({ error: error instanceof Error ? error.message : 'Failed to fetch commits' });
            }
            finally {
                set({ isLoading: false });
            }
        },
        fetchIssues: async (repoId) => {
            set({ isLoading: true, error: null });
            try {
                const { data, error } = await supabase.functions.invoke('github-repo-management', {
                    body: { action: 'fetch-issues', repoId }
                });
                if (error)
                    throw error;
                set(state => ({
                    issues: {
                        ...state.issues,
                        [repoId]: data.issues || []
                    }
                }));
            }
            catch (error) {
                set({ error: error instanceof Error ? error.message : 'Failed to fetch issues' });
            }
            finally {
                set({ isLoading: false });
            }
        },
        fetchPullRequests: async (repoId) => {
            set({ isLoading: true, error: null });
            try {
                const { data, error } = await supabase.functions.invoke('github-repo-management', {
                    body: { action: 'fetch-pull-requests', repoId }
                });
                if (error)
                    throw error;
                set(state => ({
                    pullRequests: {
                        ...state.pullRequests,
                        [repoId]: data.pullRequests || []
                    }
                }));
            }
            catch (error) {
                set({ error: error instanceof Error ? error.message : 'Failed to fetch pull requests' });
            }
            finally {
                set({ isLoading: false });
            }
        },
        // UI Actions
        setShowImportModal: (show) => set({ showImportModal: show }),
        setShowProfileDialog: (show) => set({ showProfileDialog: show }),
        setShowConnectDialog: (show) => set({ showConnectDialog: show }),
        setShowDisconnectDialog: (show) => set({ showDisconnectDialog: show }),
        setShowAccountSwitcher: (show) => set({ showAccountSwitcher: show }),
        // Error Handling
        setError: (error) => set({ error }),
        clearError: () => set({ error: null }),
        // Reset
        reset: () => set(initialState),
        // OAuth Actions
        handleOAuthMessage: oauthActions.handleOAuthMessage,
        setupOAuthListener: oauthActions.setupOAuthListener,
    };
}, {
    name: 'github-store',
    partialize: (state) => ({
        isConnected: state.isConnected,
        currentUser: state.currentUser,
        linkedAccounts: state.linkedAccounts,
    }),
})));
