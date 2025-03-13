
import { useEffect } from "react";
import { useGitHubConnectionState } from "./useGitHubConnectionState";
import { useGitHubConnectionCheck } from "./useGitHubConnectionCheck";
import { useGitHubConnect } from "./useGitHubConnect";
import { useGitHubDisconnect } from "./useGitHubDisconnect";
import { useGitHubOAuthCallback } from "./useGitHubOAuthCallback";
import { toast } from "sonner";

export function useGitHubConnection() {
  const {
    isConnected,
    username,
    connectionStatus,
    errorMessage,
    isCheckingConnection,
    debugInfo,
    setIsConnected,
    setUsername,
    setConnectionStatus,
    setErrorMessage,
    setIsCheckingConnection,
    setDebugInfo,
    updateConnectionFromData
  } = useGitHubConnectionState();

  const { checkConnection } = useGitHubConnectionCheck(
    setIsCheckingConnection,
    updateConnectionFromData
  );

  const { connect } = useGitHubConnect({
    setConnectionStatus,
    setErrorMessage,
    setDebugInfo
  });

  const { disconnect } = useGitHubDisconnect(
    setIsCheckingConnection,
    updateConnectionFromData
  );

  // Set up the OAuth callback handler
  useGitHubOAuthCallback({
    setConnectionStatus,
    setErrorMessage,
    setUsername,
    checkConnection,
    setIsCheckingConnection
  });

  // Check connection on initial load
  useEffect(() => {
    const initialCheck = async () => {
      await checkConnection();
    };
    
    initialCheck();
  }, [checkConnection]);

  return {
    isConnected,
    username,
    connectionStatus,
    errorMessage,
    isCheckingConnection,
    debugInfo,
    connect,
    disconnect,
    checkConnection
  };
}
