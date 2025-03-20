import { useGitHubStore } from '@/stores/features/github';
export function useGitHubConnect() {
    const { connect: connectGitHub } = useGitHubStore();
    return {
        connectGitHub
    };
}
