
import { Button } from "@/components/ui/button";
import { FolderGit2, GitPullRequest } from "lucide-react";

interface GitHubConnectedActionsProps {
  isConnected: boolean;
}

export function GitHubConnectedActions({ isConnected }: GitHubConnectedActionsProps) {
  if (!isConnected) return null;
  
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
      <Button
        variant="outline"
        className="justify-start"
        disabled={!isConnected}
      >
        <FolderGit2 className="mr-2 h-4 w-4" />
        Browse Repositories
      </Button>
      
      <Button
        variant="outline"
        className="justify-start"
        disabled={!isConnected}
      >
        <GitPullRequest className="mr-2 h-4 w-4" />
        View Pull Requests
      </Button>
    </div>
  );
}
