
import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { GitHubConnectionStatus } from "./github/GitHubConnectionStatus";
import { GitHubErrorMessage } from "./github/GitHubErrorMessage";
import { GitHubConnectedActions } from "./github/GitHubConnectedActions";
import { useGitHubConnection } from "@/hooks/github/useGitHubConnection";

export function GitHubSettings() {
  const {
    isConnected,
    username,
    connectionStatus,
    errorMessage,
    isCheckingConnection,
    connect,
    disconnect
  } = useGitHubConnection();

  return (
    <Card>
      <CardHeader>
        <CardTitle>GitHub Integration</CardTitle>
        <CardDescription>Connect your GitHub account to access repositories and collaborate on code</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <GitHubConnectionStatus
          isConnected={isConnected}
          username={username}
          loading={isCheckingConnection}
          connectionStatus={connectionStatus}
          onConnect={connect}
          onDisconnect={disconnect}
        />
        
        <GitHubErrorMessage 
          errorMessage={errorMessage}
          connectionStatus={connectionStatus}
        />
        
        <GitHubConnectedActions isConnected={isConnected} />
      </CardContent>
    </Card>
  );
}
