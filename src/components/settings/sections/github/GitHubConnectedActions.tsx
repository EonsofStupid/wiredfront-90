
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { GitBranch, GitPullRequest, RefreshCw, Share2 } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "sonner";

interface GitHubConnectedActionsProps {
  isConnected: boolean;
  username?: string | null;
  repoCount?: number;
  isLoading?: boolean;
}

export function GitHubConnectedActions({
  isConnected,
  username,
  repoCount,
  isLoading = false
}: GitHubConnectedActionsProps) {
  const [isSyncing, setIsSyncing] = useState(false);
  
  if (!isConnected) return null;
  
  const syncRepositories = async () => {
    setIsSyncing(true);
    try {
      // In a real implementation, this would call an API to sync repositories
      // For now we'll simulate it with a toast notification
      await new Promise(resolve => setTimeout(resolve, 2000));
      toast.success("GitHub repositories synchronized successfully");
    } catch (error) {
      toast.error("Failed to sync repositories");
      console.error("Repository sync error:", error);
    } finally {
      setIsSyncing(false);
    }
  };
  
  return (
    <div className="space-y-4">
      <Card className="bg-card">
        <CardHeader className="pb-2">
          <CardTitle className="text-base">GitHub Actions</CardTitle>
          <CardDescription>
            Manage your GitHub integration
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {isLoading ? (
            <div className="space-y-2">
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-3/4" />
            </div>
          ) : (
            <div>
              <p className="text-sm text-muted-foreground">
                Connected as <span className="font-medium text-primary">@{username}</span>
              </p>
              {repoCount !== undefined && (
                <p className="text-sm text-muted-foreground">
                  {repoCount} repositories available
                </p>
              )}
            </div>
          )}
          
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <Button
              variant="outline"
              size="sm"
              className="justify-start gap-2"
              onClick={syncRepositories}
              disabled={isSyncing}
            >
              {isSyncing ? (
                <RefreshCw className="h-4 w-4 animate-spin" />
              ) : (
                <RefreshCw className="h-4 w-4" />
              )}
              {isSyncing ? "Syncing..." : "Sync Repositories"}
            </Button>
            
            <Button
              variant="outline"
              size="sm"
              className="justify-start gap-2"
            >
              <GitBranch className="h-4 w-4" />
              Manage Branches
            </Button>
            
            <Button
              variant="outline"
              size="sm"
              className="justify-start gap-2"
            >
              <GitPullRequest className="h-4 w-4" />
              View Pull Requests
            </Button>
            
            <Button
              variant="outline"
              size="sm"
              className="justify-start gap-2"
            >
              <Share2 className="h-4 w-4" />
              Share Access
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
