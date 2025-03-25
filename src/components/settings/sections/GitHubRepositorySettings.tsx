
import React from "react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useGitHubConnection } from "@/hooks/useGitHubConnection";
import { GitHubConnectionStatus } from "./github/GitHubConnectionStatus";
import { GitHubErrorMessage } from "./github/GitHubErrorMessage";

export function GitHubRepositorySettings() {
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
        <CardTitle>GitHub Repositories</CardTitle>
        <CardDescription>Manage your connected GitHub repositories</CardDescription>
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
        
        {isConnected && (
          <div className="pt-4">
            <h3 className="text-base font-medium mb-2">Your Repositories</h3>
            <p className="text-sm text-muted-foreground mb-4">
              Select which repositories to sync with the platform
            </p>
            
            <div className="rounded-md bg-muted p-8 text-center">
              <p className="text-muted-foreground">
                Connect to GitHub to manage your repositories
              </p>
              <Button 
                variant="outline" 
                className="mt-2"
                onClick={connectGitHub}
                disabled={isChecking || isConnected}
              >
                Connect GitHub
              </Button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
