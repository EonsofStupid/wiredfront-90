import { useGitHubStore } from '@/stores/features/github';
export function useGitHubConnectionState() {
    const { isConnected, isLoading, error, currentUser, linkedAccounts } = useGitHubStore();
    return {
        isConnected,
        isLoading,
        error,
        githubUsername: currentUser?.login,
        linkedAccounts
    };
}
