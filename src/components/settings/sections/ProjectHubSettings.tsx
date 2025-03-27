import React, { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { GitHubConnectionStatus } from "@/components/settings/sections/github/GitHubConnectionStatus";
import { useGitHubConnection } from "@/hooks/github/useGitHubConnection";
import { GitHubRepositorySettings } from "./GitHubRepositorySettings";

export function ProjectHubSettings() {
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
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Project Hub Integration</CardTitle>
          <CardDescription>Connect to various project hubs to streamline your workflow</CardDescription>
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
        </CardContent>
      </Card>
      
      {isConnected && (
        <GitHubRepositorySettings />
      )}
    </div>
  );
}
