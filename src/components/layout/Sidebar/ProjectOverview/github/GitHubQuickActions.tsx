
import React from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  GitBranch, 
  RefreshCw, 
  GitPullRequest,
  Settings,
  Code,
  AlertCircle
} from "lucide-react";
import { NavigationService } from "@/services/navigation/NavigationService";

interface GitHubQuickActionsProps {
  username: string | null;
  onRefreshConnection: () => void;
  onOpenRepositories: () => void;
  isRefreshing?: boolean;
}

export function GitHubQuickActions({ 
  username,
  onRefreshConnection,
  onOpenRepositories,
  isRefreshing = false
}: GitHubQuickActionsProps) {
  
  const handleOpenSettings = (section: string) => {
    NavigationService.navigateToSettings(section);
  };
  
  if (!username) {
    return (
      <Card className="bg-background/30 border border-neon-blue/20 p-3">
        <div className="flex items-center gap-2 mb-2 text-sm font-medium">
          <AlertCircle className="h-4 w-4 text-amber-500" />
          <span>GitHub Not Connected</span>
        </div>
        <div className="text-xs text-muted-foreground mb-2">
          Connect your GitHub account to access quick actions.
        </div>
      </Card>
    );
  }
  
  return (
    <Card className="bg-background/30 border border-neon-blue/20 p-3">
      <h3 className="text-sm font-medium mb-2 flex items-center gap-1.5">
        <Settings className="h-4 w-4 text-neon-blue" />
        Quick Actions
      </h3>
      
      <div className="grid grid-cols-2 gap-2">
        <Button
          variant="outline"
          size="sm"
          className="h-9 text-xs justify-start border-neon-blue/20 hover:bg-neon-blue/10"
          onClick={onOpenRepositories}
        >
          <Code className="h-3.5 w-3.5 mr-2 text-neon-blue" />
          Repositories
        </Button>
        
        <Button
          variant="outline"
          size="sm"
          className="h-9 text-xs justify-start border-neon-blue/20 hover:bg-neon-blue/10"
          onClick={onRefreshConnection}
          disabled={isRefreshing}
        >
          <RefreshCw className={`h-3.5 w-3.5 mr-2 text-neon-blue ${isRefreshing ? 'animate-spin' : ''}`} />
          {isRefreshing ? 'Refreshing...' : 'Refresh Sync'}
        </Button>
        
        <Button
          variant="outline"
          size="sm"
          className="h-9 text-xs justify-start border-neon-blue/20 hover:bg-neon-blue/10"
          onClick={() => handleOpenSettings('github')}
        >
          <GitPullRequest className="h-3.5 w-3.5 mr-2 text-neon-pink" />
          Manage Auth
        </Button>
        
        <Button
          variant="outline"
          size="sm"
          className="h-9 text-xs justify-start border-neon-blue/20 hover:bg-neon-blue/10"
          onClick={() => NavigationService.openExternalUrl(`https://github.com/${username}`)}
        >
          <GitBranch className="h-3.5 w-3.5 mr-2 text-neon-blue" />
          Open GitHub
        </Button>
      </div>
    </Card>
  );
}
