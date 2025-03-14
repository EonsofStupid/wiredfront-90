
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
import { GitHubDisconnectDialog } from "@/components/github/GitHubDisconnectDialog";

interface ProjectOverviewProps {
  className?: string;
  isCompact?: boolean;
}

export function ProjectOverview({ className, isCompact = false }: ProjectOverviewProps) {
  const {
    projects,
    activeProject,
    activeProjectId,
    isLoadingProjects,
    isConnected,
    isChecking,
    connectionStatus,
    isIndexing,
    recentlyImportedProject,
    isConnectDialogOpen,
    setIsConnectDialogOpen,
    isDisconnectDialogOpen,
    setIsDisconnectDialogOpen,
    isImportModalOpen,
    setIsImportModalOpen,
    githubUsername,
    errorMessage,
    handleAddProject,
    handleGitHubConnect,
    handleImportProject,
    handleOpenImportModal,
    handleDeleteProject,
    connectGitHub,
    disconnectGitHub,
    setActiveProject
  } = useProjectOverview();
  
  return (
    <div className={cn(
      "flex flex-col h-full", 
      "bg-gradient-to-br from-dark-lighter/30 to-transparent backdrop-blur-md",
      "border-neon-blue/20",
      "z-[var(--z-projecthub)]",
      className
    )}>
      <ProjectOverviewHeader />
      
      <GitHubConnectionSection
        isConnected={isConnected}
        isChecking={isChecking}
        connectionStatus={connectionStatus}
        username={githubUsername}
        onConnect={handleGitHubConnect}
        onDisconnect={() => setIsDisconnectDialogOpen(true)}
      />
      
      <IndexingStatusSection
        isIndexing={isIndexing}
        recentlyImportedProject={recentlyImportedProject}
      />
      
      <ScrollArea className="flex-1">
        {activeProject ? (
          <ProjectDetails
            project={{
              id: activeProject.id,
              name: activeProject.name,
              description: activeProject.description,
              lastModified: new Date(activeProject.updated_at),
              github_repo: activeProject.github_repo,
              language: activeProject.tech_stack?.primaryLanguage,
              files_count: activeProject.tech_stack?.files_count
            }}
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
        projects={projects?.map(p => ({
          ...p,
          lastModified: new Date(p.updated_at)
        })) || []}
        activeProjectId={activeProjectId}
        onSelectProject={setActiveProject}
        onAddProject={handleAddProject}
        onImportProject={handleOpenImportModal}
        onDeleteProject={handleDeleteProject}
        isGithubConnected={isConnected}
        isLoading={isLoadingProjects}
      />
      
      <GitHubConnectDialog
        open={isConnectDialogOpen}
        onOpenChange={setIsConnectDialogOpen}
        onConnect={connectGitHub}
        errorMessage={errorMessage}
        connectionStatus={connectionStatus.status}
      />
      
      <GitHubDisconnectDialog
        open={isDisconnectDialogOpen}
        onOpenChange={setIsDisconnectDialogOpen}
        onDisconnect={disconnectGitHub}
        username={githubUsername}
      />
      
      <GitHubImportModal
        isOpen={isImportModalOpen}
        onClose={() => setIsImportModalOpen(false)}
        onImportComplete={handleImportProject}
      />
    </div>
  );
}
