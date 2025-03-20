import { useAuthStore } from '@/stores/auth';
import { useGitHubStore } from '@/stores/features/github';
import { useEffect } from 'react';
export function useGitHubConnectionCheck() {
    const { checkConnection } = useGitHubStore();
    const { user } = useAuthStore();
    useEffect(() => {
        if (user?.id) {
            checkConnection();
        }
    }, [user?.id, checkConnection]);
}
