
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useGitHubConnection } from '@/hooks/useGitHubConnection';
import { Button } from '@/components/ui/button';
import { GitHubConnectionStatus } from './GitHubConnectionStatus';
import { GitHubErrorMessage } from './GitHubErrorMessage';
import { RepoIcon, RefreshCw } from 'lucide-react';

export function GitHubRepositorySettings() {
  const {
    isConnected,
    isChecking,
    connectionStatus,
    connectGitHub,
    disconnectGitHub,
    refreshConnection
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
          <div className="mt-6 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-medium">Your Repositories</h3>
              <Button variant="outline" size="sm" onClick={refreshConnection}>
                <RefreshCw className="h-4 w-4 mr-1" />
                Refresh
              </Button>
            </div>
            
            <div className="border rounded-md p-4 bg-muted/20">
              <div className="flex flex-col items-center justify-center py-8 text-center">
                <RepoIcon className="h-12 w-12 text-muted-foreground mb-4" />
                <h3 className="text-lg font-medium">No repositories yet</h3>
                <p className="text-muted-foreground mt-1 max-w-md">
                  Connect repositories to enable GitHub integration with the chat
                </p>
                <Button className="mt-4">Connect Repository</Button>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
