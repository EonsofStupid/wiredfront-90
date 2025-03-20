import { useGitHubStore } from '@/stores/features/github';
import { useEffect } from 'react';
export function useGitHubOAuthCallback() {
    const { setupOAuthListener } = useGitHubStore();
    useEffect(() => {
        const cleanup = setupOAuthListener();
        return cleanup;
    }, [setupOAuthListener]);
}
