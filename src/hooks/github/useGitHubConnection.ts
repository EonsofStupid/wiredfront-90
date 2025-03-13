
import { useEffect, useState } from "react";
import { useGitHubConnectionState } from "./useGitHubConnectionState";
import { useGitHubConnectionCheck } from "./useGitHubConnectionCheck";
import { useGitHubConnect } from "./useGitHubConnect";
import { useGitHubDisconnect } from "./useGitHubDisconnect";
import { useGitHubOAuthCallback } from "./useGitHubOAuthCallback";
import { toast } from "sonner";

export function useGitHubConnection() {
  const [initialCheckDone, setInitialCheckDone] = useState(false);

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

  // Check connection on initial load only once
  useEffect(() => {
    const initialCheck = async () => {
      if (!initialCheckDone) {
        console.log("Performing initial GitHub connection check");
        try {
          setIsCheckingConnection(true);
          await checkConnection();
        } catch (error) {
          console.error("Error during initial GitHub connection check:", error);
          // If check fails, ensure we're in disconnected state
          setIsConnected(false);
          setUsername(null);
          setConnectionStatus('idle');
        } finally {
          setIsCheckingConnection(false);
          setInitialCheckDone(true);
          console.log("Initial GitHub connection check completed");
        }
      }
    };
    
    initialCheck();
  }, [checkConnection, initialCheckDone, setIsCheckingConnection, setIsConnected, setUsername, setConnectionStatus]);

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
