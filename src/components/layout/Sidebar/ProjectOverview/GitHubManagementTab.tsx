
import React, { useState, useEffect } from "react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ErrorMessage } from "@/components/ui/error-message";
import { useRouter } from "next/router";
import { 
  Github, 
  UserCog, 
  History,
  RefreshCw,
  AlertCircle
} from "lucide-react";
import { cn } from "@/lib/utils";
import { GitHubAccountCard } from "./github/GitHubAccountCard";
import { GitHubQuickActions } from "./github/GitHubQuickActions";
import { GitHubRecentActivity } from "./github/GitHubRecentActivity";

interface GitHubManagementTabProps {
  isConnected: boolean;
  githubUsername: string | null;
  connectGitHub: () => void;
  disconnectGitHub: () => void;
  isChecking?: boolean;
  checkConnectionStatus?: () => void;
  linkedAccounts?: Array<{
    id: string;
    username: string;
    default: boolean;
  }>;
  error?: string | null;
}

export function GitHubManagementTab({
  isConnected,
  githubUsername,
  connectGitHub,
  disconnectGitHub,
  isChecking = false,
  checkConnectionStatus = () => {},
  linkedAccounts = [],
  error = null
}: GitHubManagementTabProps) {
  const router = useRouter();
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [tabError, setTabError] = useState<string | null>(error);
  
  useEffect(() => {
    setTabError(error);
  }, [error]);
  
  const handleRefreshConnection = async () => {
    try {
      setIsRefreshing(true);
      await checkConnectionStatus();
      setTabError(null);
    } catch (err) {
      setTabError(err instanceof Error ? err.message : "Failed to refresh GitHub connection");
    } finally {
      setIsRefreshing(false);
    }
  };
  
  const handleOpenRepositories = () => {
    try {
      router.push('/settings?tab=github-repos');
    } catch (error) {
      console.error("Navigation error:", error);
      // Fallback to window.location if router fails
      window.location.href = '/settings?tab=github-repos';
    }
  };
  
  if (!isConnected) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center p-4">
        <div className="text-center space-y-4">
          <Github className="h-12 w-12 mx-auto text-neon-blue/50" />
          <h3 className="text-lg font-medium text-neon-blue">GitHub Not Connected</h3>
          <p className="text-sm text-muted-foreground">
            Connect your GitHub account to manage repositories and track sync status.
          </p>
          <Button 
            onClick={connectGitHub}
            disabled={isChecking}
            className="bg-neon-blue hover:bg-neon-blue/80"
          >
            {isChecking ? (
              <>
                <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                Connecting...
              </>
            ) : (
              <>
                <Github className="h-4 w-4 mr-2" />
                Connect GitHub
              </>
            )}
          </Button>
        </div>
      </div>
    );
  }
  
  return (
    <ScrollArea className="flex-1">
      <div className="p-4 space-y-4">
        {tabError && (
          <ErrorMessage 
            message={tabError} 
            className="mb-4"
          />
        )}
        
        <GitHubAccountCard 
          username={githubUsername} 
          accounts={linkedAccounts}
          onAddAccount={connectGitHub}
          onDisconnect={disconnectGitHub}
        />
        
        <GitHubQuickActions 
          username={githubUsername} 
          onRefreshConnection={handleRefreshConnection}
          onOpenRepositories={handleOpenRepositories}
          isRefreshing={isRefreshing}
        />
        
        <Card className="bg-background/30 border border-neon-blue/20 p-3">
          <h3 className="text-sm font-medium mb-2 flex items-center gap-1.5">
            <History className="h-4 w-4 text-neon-pink" />
            Recent Activity
          </h3>
          <GitHubRecentActivity username={githubUsername} />
        </Card>
        
        <div className="text-center pt-2">
          <Button
            variant="link"
            size="sm"
            className="text-xs text-muted-foreground hover:text-neon-blue"
            onClick={() => {
              try {
                router.push('/settings?tab=github');
              } catch (error) {
                console.error("Navigation error:", error);
                window.location.href = '/settings?tab=github';
              }
            }}
          >
            <UserCog className="h-3 w-3 mr-1" />
            Advanced GitHub Settings
          </Button>
        </div>
      </div>
    </ScrollArea>
  );
}
