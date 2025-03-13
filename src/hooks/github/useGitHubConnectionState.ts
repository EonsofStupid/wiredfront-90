
import { useState } from "react";
import { GitHubConnectionState, GitHubAuthError } from "@/types/admin/settings/github";

export function useGitHubConnectionState() {
  // Connection state
  const [isConnected, setIsConnected] = useState<boolean>(false);
  const [username, setUsername] = useState<string | null>(null);
  const [connectionStatus, setConnectionStatus] = useState<GitHubConnectionState>('idle');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isCheckingConnection, setIsCheckingConnection] = useState<boolean>(false);
  const [debugInfo, setDebugInfo] = useState<Record<string, any> | null>(null);
  
  // Function to update connection state from API response
  const updateConnectionFromData = (connection: any) => {
    if (!connection) {
      setIsConnected(false);
      setUsername(null);
      setConnectionStatus('idle');
      return;
    }
    
    setIsConnected(true);
    setUsername(connection.account_username || null);
    setConnectionStatus('connected');
    setErrorMessage(null);
    
    console.log('Updated GitHub connection state:', {
      isConnected: true,
      username: connection.account_username,
      scopes: connection.scopes
    });
  };
  
  return {
    // State
    isConnected,
    username,
    connectionStatus,
    errorMessage,
    isCheckingConnection,
    debugInfo,
    
    // State setters
    setIsConnected,
    setUsername,
    setConnectionStatus,
    setErrorMessage,
    setIsCheckingConnection,
    setDebugInfo,
    
    // Helper functions
    updateConnectionFromData
  };
}
