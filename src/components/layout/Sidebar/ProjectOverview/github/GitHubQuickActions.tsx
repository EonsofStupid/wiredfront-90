
import React from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  GitBranch, 
  RefreshCw, 
  GitPullRequest,
  Settings,
  Code
} from "lucide-react";
import { useRouter } from "next/router";

interface GitHubQuickActionsProps {
  username: string | null;
  onRefreshConnection: () => void;
  onOpenRepositories: () => void;
}

export function GitHubQuickActions({ 
  username,
  onRefreshConnection,
  onOpenRepositories
}: GitHubQuickActionsProps) {
  const router = useRouter();
  
  const handleOpenSettings = (section: string) => {
    router.push(`/settings?tab=${section}`);
  };
  
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
        >
          <RefreshCw className="h-3.5 w-3.5 mr-2 text-neon-blue" />
          Refresh Sync
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
          onClick={() => window.open(`https://github.com/${username}`, '_blank')}
          disabled={!username}
        >
          <GitBranch className="h-3.5 w-3.5 mr-2 text-neon-blue" />
          Open GitHub
        </Button>
      </div>
    </Card>
  );
}
