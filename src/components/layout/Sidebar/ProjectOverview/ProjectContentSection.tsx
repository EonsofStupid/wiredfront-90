
import { useState } from "react";
import { ProjectDetails } from "@/components/projects/ProjectDetails";
import { ProjectActions } from "@/components/projects/ProjectActions";
import { logger } from "@/services/chat/LoggingService";
import { GitHubImportModal } from "@/components/github/GitHubImportModal";

interface Project {
  id: string;
  name: string;
  description?: string;
  lastModified: Date;
  github_repo?: string;
}

interface ProjectContentSectionProps {
  activeProject: Project | undefined;
  isGithubConnected: boolean;
  githubUsername: string | null;
  onAddProject: () => void;
  onImportComplete: (projectId: string) => void;
}

export function ProjectContentSection({
  activeProject,
  isGithubConnected,
  githubUsername,
  onAddProject,
  onImportComplete
}: ProjectContentSectionProps) {
  const [isImportModalOpen, setIsImportModalOpen] = useState(false);

  const handleOpenImportModal = () => {
    logger.info("Import from GitHub button clicked");
    
    if (!isGithubConnected) {
      logger.warn("GitHub import attempted without connection");
      return;
    }
    
    setIsImportModalOpen(true);
  };

  if (activeProject) {
    return (
      <ProjectDetails
        project={activeProject}
        isGithubConnected={isGithubConnected}
        githubUsername={githubUsername}
      />
    );
  }

  return (
    <>
      <div className="flex flex-col items-center justify-center h-full p-4 space-y-6">
        <div className="text-center space-y-2">
          <h3 className="text-lg font-medium">No Project Selected</h3>
          <p className="text-sm text-muted-foreground">Create a new project or select one from the list below</p>
        </div>
        
        <ProjectActions 
          onAddProject={onAddProject} 
          onImportProject={handleOpenImportModal}
        />
      </div>
      
      <GitHubImportModal
        isOpen={isImportModalOpen}
        onClose={() => setIsImportModalOpen(false)}
        onImportComplete={onImportComplete}
      />
    </>
  );
}
