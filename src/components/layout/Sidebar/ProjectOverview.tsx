
import { useUIStore } from "@/stores";
import { cn } from "@/lib/utils";
import { useState } from "react";
import { useGitHubConnection } from "@/hooks/useGitHubConnection";
import { GitHubStatusSection } from "@/components/github/GitHubStatusSection";
import { GitHubConnectDialog } from "@/components/github/GitHubConnectDialog";
import { ProjectList } from "@/components/projects/ProjectList";
import { ProjectDetails } from "@/components/projects/ProjectDetails";
import { ProjectActions } from "@/components/projects/ProjectActions";

interface ProjectOverviewProps {
  className?: string;
  isCompact: boolean;
}

export const ProjectOverview = ({ className }: ProjectOverviewProps) => {
  const { 
    project: { projects, activeProjectId },
    setActiveProject, 
    addProject 
  } = useUIStore();
  
  const [isConnectDialogOpen, setIsConnectDialogOpen] = useState(false);
  
  const {
    isConnected: isGithubConnected,
    username: githubUsername,
    connectionStatus,
    errorMessage,
    isCheckingConnection,
    connect: connectGitHub,
    disconnect: disconnectGitHub
  } = useGitHubConnection();
  
  const activeProject = projects.find(p => p.id === activeProjectId);
  
  const handleAddProject = () => {
    addProject({
      name: `New Project ${projects.length + 1}`,
      description: "Add a description",
      lastModified: new Date(),
    });
  };

  const handleGitHubConnect = () => {
    setIsConnectDialogOpen(true);
    connectGitHub();
  };
  
  return (
    <div className={cn("flex flex-col h-full", className)}>
      <div className="p-4 border-b border-neon-blue/20">
        <h2 className="text-neon-blue font-medium text-xl">Project Hub</h2>
      </div>
      
      <GitHubStatusSection
        isConnected={isGithubConnected}
        username={githubUsername}
        isCheckingConnection={isCheckingConnection}
        onConnect={handleGitHubConnect}
        onDisconnect={disconnectGitHub}
        connectionStatus={connectionStatus}
      />
      
      <div className="flex-1 overflow-auto">
        {activeProject ? (
          <ProjectDetails
            project={activeProject}
            isGithubConnected={isGithubConnected}
            githubUsername={githubUsername}
          />
        ) : (
          <div className="flex flex-col items-center justify-center h-full p-4 space-y-6">
            <div className="text-center space-y-2">
              <h3 className="text-lg font-medium">No Project Selected</h3>
              <p className="text-sm text-muted-foreground">Create a new project or select one from the list below</p>
            </div>
            
            <ProjectActions onAddProject={handleAddProject} />
          </div>
        )}
      </div>
      
      <ProjectList
        projects={projects}
        activeProjectId={activeProjectId}
        onSelectProject={setActiveProject}
        onAddProject={handleAddProject}
      />
      
      <GitHubConnectDialog
        open={isConnectDialogOpen}
        onOpenChange={setIsConnectDialogOpen}
        onConnect={connectGitHub}
        errorMessage={errorMessage}
        connectionStatus={connectionStatus}
      />
    </div>
  );
};
