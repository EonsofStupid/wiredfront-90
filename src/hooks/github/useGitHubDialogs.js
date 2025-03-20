import { useGitHubStore } from '@/stores/features/github';
/**
 * Hook for managing GitHub connection dialog states
 */
export function useGitHubDialogs() {
    const { showImportModal, showProfileDialog, showConnectDialog, showDisconnectDialog, showAccountSwitcher, setShowImportModal, setShowProfileDialog, setShowConnectDialog, setShowDisconnectDialog, setShowAccountSwitcher } = useGitHubStore();
    return {
        showImportModal,
        showProfileDialog,
        showConnectDialog,
        showDisconnectDialog,
        showAccountSwitcher,
        setShowImportModal,
        setShowProfileDialog,
        setShowConnectDialog,
        setShowDisconnectDialog,
        setShowAccountSwitcher
    };
}
