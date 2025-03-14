
import { cn } from "@/lib/utils";
import { useProjectOverview } from "./useProjectOverview";
import { ProjectOverviewHeader } from "./ProjectOverviewHeader";
import { GitHubConnectionSection } from "./GitHubConnectionSection";
import { IndexingStatusSection } from "./IndexingStatusSection";
import { ScrollArea } from "@/components/ui/scroll-area";
import { ProjectList } from "@/components/projects/ProjectList";
import { GitHubConnectDialog } from "@/components/github/GitHubConnectDialog";
import { GitHubImportModal } from "@/components/github/GitHubImportModal";
import { ProjectDetails } from "@/components/projects/ProjectDetails";

interface ProjectOverviewProps {
  className?: string;
  isCompact?: boolean;
}

export function ProjectOverview({ className, isCompact = false }: ProjectOverviewProps) {
  const {
    projects,
    activeProject,
    activeProjectId,
    isConnected,
    isChecking,
    connectionStatus,
    isIndexing,
    recentlyImportedProject,
    isConnectDialogOpen,
    setIsConnectDialogOpen,
    isImportModalOpen,
    setIsImportModalOpen,
    githubUsername,
    errorMessage,
    handleAddProject,
    handleGitHubConnect,
    handleImportProject,
    handleOpenImportModal,
    connectGitHub,
    disconnectGitHub,
    setActiveProject
  } = useProjectOverview();
  
  return (
    <div className={cn(
      "flex flex-col h-full", 
      "bg-gradient-to-br from-dark-lighter/30 to-transparent backdrop-blur-md",
      "border-neon-blue/20",
      className
    )}>
      <ProjectOverviewHeader />
      
      <GitHubConnectionSection
        isConnected={isConnected}
        isChecking={isChecking}
        connectionStatus={connectionStatus}
        username={githubUsername}
        onConnect={handleGitHubConnect}
        onDisconnect={disconnectGitHub}
      />
      
      <IndexingStatusSection
        isIndexing={isIndexing}
        recentlyImportedProject={recentlyImportedProject}
      />
      
      <ScrollArea className="flex-1">
        {activeProject ? (
          <ProjectDetails
            project={activeProject}
            isGithubConnected={isConnected}
            githubUsername={githubUsername}
          />
        ) : (
          <div className="p-4 text-center">
            <p className="text-sm text-gray-400">No project selected</p>
          </div>
        )}
      </ScrollArea>
      
      <ProjectList
        projects={projects}
        activeProjectId={activeProjectId}
        onSelectProject={setActiveProject}
        onAddProject={handleAddProject}
        onImportProject={handleOpenImportModal}
        isGithubConnected={isConnected}
      />
      
      <GitHubConnectDialog
        open={isConnectDialogOpen}
        onOpenChange={setIsConnectDialogOpen}
        onConnect={connectGitHub}
        errorMessage={errorMessage}
        connectionStatus={connectionStatus}
      />
      
      <GitHubImportModal
        isOpen={isImportModalOpen}
        onClose={() => setIsImportModalOpen(false)}
        onImportComplete={handleImportProject}
      />
    </div>
  );
}
