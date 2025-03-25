
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ArrowRight, Github, Code, GitMerge, History } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface GitHubConnectedActionsProps {
  isConnected: boolean;
}

export function GitHubConnectedActions({ isConnected }: GitHubConnectedActionsProps) {
  const navigate = useNavigate();

  if (!isConnected) {
    return null;
  }

  const handleNavigateToRepos = () => {
    navigate('/settings?tab=github-repos');
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      <Card className="p-4 hover:shadow-md transition-shadow cursor-pointer" onClick={handleNavigateToRepos}>
        <div className="flex flex-col items-center text-center gap-2">
          <Code className="h-10 w-10 text-blue-500" />
          <h3 className="font-medium">Manage Repositories</h3>
          <p className="text-sm text-muted-foreground">View and control synced repositories</p>
          <Button variant="link" size="sm" className="mt-2">
            Open <ArrowRight className="ml-1 h-4 w-4" />
          </Button>
        </div>
      </Card>
      
      <Card className="p-4 hover:shadow-md transition-shadow">
        <div className="flex flex-col items-center text-center gap-2">
          <GitMerge className="h-10 w-10 text-green-500" />
          <h3 className="font-medium">Sync Settings</h3>
          <p className="text-sm text-muted-foreground">Configure automatic code synchronization</p>
          <Button variant="link" size="sm" className="mt-2">
            Configure <ArrowRight className="ml-1 h-4 w-4" />
          </Button>
        </div>
      </Card>
      
      <Card className="p-4 hover:shadow-md transition-shadow">
        <div className="flex flex-col items-center text-center gap-2">
          <History className="h-10 w-10 text-purple-500" />
          <h3 className="font-medium">Activity History</h3>
          <p className="text-sm text-muted-foreground">View your GitHub activity timeline</p>
          <Button variant="link" size="sm" className="mt-2">
            View History <ArrowRight className="ml-1 h-4 w-4" />
          </Button>
        </div>
      </Card>
    </div>
  );
}
