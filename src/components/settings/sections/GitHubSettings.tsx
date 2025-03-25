import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { GitHubConnectionStatus } from "./github/GitHubConnectionStatus";
import { GitHubErrorMessage } from "./github/GitHubErrorMessage";
import { GitHubConnectedActions } from "./github/GitHubConnectedActions";
import { useGitHubConnection } from "@/hooks/useGitHubConnection";

export function GitHubSettings() {
  const {
    isConnected,
    isChecking,
    connectionStatus,
    connectGitHub,
    disconnectGitHub
  } = useGitHubConnection();

  // Extract username and error message from connection status
  const githubUsername = connectionStatus.metadata?.username || null;
  const errorMessage = connectionStatus.errorMessage || null;

  return (
    <Card>
      <CardHeader>
        <CardTitle>GitHub Integration</CardTitle>
        <CardDescription>Connect your GitHub account to access repositories and collaborate on code</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <GitHubConnectionStatus
          isConnected={isConnected}
          username={githubUsername}
          loading={isChecking}
          connectionStatus={connectionStatus.status === "connected" ? "connected" : 
                           connectionStatus.status === "pending" ? "connecting" : 
                           connectionStatus.status === "error" ? "error" : "idle"}
          onConnect={connectGitHub}
          onDisconnect={disconnectGitHub}
        />
        
        <GitHubErrorMessage 
          errorMessage={errorMessage}
          connectionStatus={connectionStatus.status === "connected" ? "connected" : 
                           connectionStatus.status === "pending" ? "connecting" : 
                           connectionStatus.status === "error" ? "error" : "idle"}
        />
        
        <GitHubConnectedActions isConnected={isConnected} />
      </CardContent>
    </Card>
  );
}
