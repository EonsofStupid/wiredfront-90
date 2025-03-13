
import { useState } from "react";
import { GitHubOAuthConnection } from "@/types/admin/settings/github";

export function useGitHubConnectionState() {
  const [isConnected, setIsConnected] = useState<boolean>(false);
  const [username, setUsername] = useState<string | null>(null);
  const [connectionStatus, setConnectionStatus] = useState<'idle' | 'connecting' | 'connected' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isCheckingConnection, setIsCheckingConnection] = useState(true);
  const [debugInfo, setDebugInfo] = useState<any>(null);

  const updateConnectionFromData = (connection: GitHubOAuthConnection | null) => {
    setIsConnected(!!connection);
    if (connection && connection.account_username) {
      setUsername(connection.account_username);
    } else {
      setUsername(null);
    }
  };

  return {
    isConnected,
    setIsConnected,
    username,
    setUsername,
    connectionStatus,
    setConnectionStatus,
    errorMessage,
    setErrorMessage,
    isCheckingConnection,
    setIsCheckingConnection,
    debugInfo,
    setDebugInfo,
    updateConnectionFromData
  };
}
