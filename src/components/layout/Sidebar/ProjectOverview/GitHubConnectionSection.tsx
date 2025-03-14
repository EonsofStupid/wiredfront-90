
import { GitHubStatusSection } from "@/components/github/GitHubStatusSection";

interface GitHubConnectionSectionProps {
  isConnected: boolean;
  isChecking: boolean;
  connectionStatus: 'idle' | 'connecting' | 'connected' | 'error';
  username: string | null;
  onConnect: () => void;
  onDisconnect: () => void;
}

export function GitHubConnectionSection({
  isConnected,
  isChecking,
  connectionStatus,
  username,
  onConnect,
  onDisconnect
}: GitHubConnectionSectionProps) {
  return (
    <GitHubStatusSection
      isConnected={isConnected}
      username={username}
      isCheckingConnection={isChecking}
      onConnect={onConnect}
      onDisconnect={onDisconnect}
      connectionStatus={connectionStatus}
    />
  );
}
