import React from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { RepositoryManagement } from "@/components/github/RepositoryManagement";
import { SyncStatusDashboard } from "@/components/github/SyncStatusDashboard";
import { AccountSwitcher } from "@/components/github/AccountSwitcher";
import { useGitHubConnection } from "@/hooks/useGitHubConnection";
import { GitHubConnectionStatus } from "./github/GitHubConnectionStatus";
import { GitHubErrorMessage } from "./github/GitHubErrorMessage";

export function GitHubRepositorySettings() {
  const {
    isConnected,
    isChecking,
    connectionStatus,
    githubUsername,
    connectGitHub,
    disconnectGitHub
  } = useGitHubConnection();

  // Extract error message from connection status
  const errorMessage = connectionStatus.errorMessage || null;

  return (
    <div className="space-y-6">
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
        </CardContent>
      </Card>
      
      {isConnected && (
        <Tabs defaultValue="accounts" className="space-y-4">
          <TabsList>
            <TabsTrigger value="accounts">Account Management</TabsTrigger>
            <TabsTrigger value="repositories">Repositories</TabsTrigger>
            <TabsTrigger value="sync">Sync Status</TabsTrigger>
          </TabsList>
          
          <TabsContent value="accounts">
            <AccountSwitcher />
          </TabsContent>
          
          <TabsContent value="repositories">
            <RepositoryManagement />
          </TabsContent>
          
          <TabsContent value="sync">
            <SyncStatusDashboard />
          </TabsContent>
        </Tabs>
      )}
    </div>
  );
}
