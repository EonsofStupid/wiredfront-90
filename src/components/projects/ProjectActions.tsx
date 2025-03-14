
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Plus, Github } from "lucide-react";
import { GitHubImportModal } from "@/components/github/GitHubImportModal";
import { useGitHubConnection } from "@/hooks/useGitHubConnection";
import { toast } from "sonner";

interface ProjectActionsProps {
  onAddProject: () => void;
  onImportProject?: (projectId: string) => void;
}

export function ProjectActions({ onAddProject, onImportProject }: ProjectActionsProps) {
  const [isImportModalOpen, setIsImportModalOpen] = useState(false);
  const { isConnected } = useGitHubConnection();

  const handleImportClick = () => {
    if (!isConnected) {
      toast.error("You need to connect your GitHub account first");
      return;
    }

    setIsImportModalOpen(true);
  };

  const handleImportComplete = (projectId: string) => {
    if (onImportProject) {
      onImportProject(projectId);
    }
  };

  return (
    <>
      <div className="flex flex-col gap-2 w-full">
        <Button 
          variant="outline" 
          size="sm" 
          onClick={onAddProject}
          className="gap-1 w-full justify-start"
        >
          <Plus className="h-4 w-4" />
          New Project
        </Button>
        
        <Button
          variant="outline"
          size="sm"
          onClick={handleImportClick}
          className="gap-1 w-full justify-start"
        >
          <Github className="h-4 w-4" />
          Import from GitHub
        </Button>
      </div>

      <GitHubImportModal 
        isOpen={isImportModalOpen}
        onClose={() => setIsImportModalOpen(false)}
        onImportComplete={handleImportComplete}
      />
    </>
  );
}
