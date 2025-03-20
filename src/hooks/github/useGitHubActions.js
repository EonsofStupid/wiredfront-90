import { useGitHubStore } from '@/stores/features/github';
/**
 * Hook for GitHub-related actions
 */
export function useGitHubActions() {
    const { connect, disconnect, setDefaultAccount, checkConnection, fetchRepositories, selectRepository, syncRepository, toggleAutoSync, fetchBranches, fetchCommits, fetchIssues, fetchPullRequests, setShowImportModal, setShowProfileDialog, setShowConnectDialog, setShowDisconnectDialog, setShowAccountSwitcher, setError, clearError, reset } = useGitHubStore();
    return {
        connect,
        disconnect,
        setDefaultAccount,
        checkConnection,
        fetchRepositories,
        selectRepository,
        syncRepository,
        toggleAutoSync,
        fetchBranches,
        fetchCommits,
        fetchIssues,
        fetchPullRequests,
        setShowImportModal,
        setShowProfileDialog,
        setShowConnectDialog,
        setShowDisconnectDialog,
        setShowAccountSwitcher,
        setError,
        clearError,
        reset
    };
}
