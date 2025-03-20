import { useGitHubStore } from '@/stores/features/github';
import { GitHubConnectionState } from "@/types/admin/settings/github";

interface UseGitHubConnectProps {
  setConnectionStatus: (status: GitHubConnectionState) => void;
  setErrorMessage: (message: string | null) => void;
  setDebugInfo: (info: Record<string, any> | null) => void;
}

export function useGitHubConnect() {
  const { connect: connectGitHub } = useGitHubStore();

  return {
    connectGitHub
  };
}
