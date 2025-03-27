import { cn } from "@/lib/utils";
import { useProjectOverview } from "./useProjectOverview";
import { ProjectOverviewHeader } from "./ProjectOverviewHeader";
import { GitHubConnectionSection } from "./GitHubConnectionSection";
import { IndexingStatusSection } from "./IndexingStatusSection";
import { ScrollArea } from "@/components/ui/scroll-area";
import { ProjectList } from "@/components/features/projects/ProjectList";
import { GitHubConnectDialog } from "@/components/features/github/module/GitHubConnectDialog";
import { GitHubImportModal } from '@/components/features/projects/onboarding/GitHubImportModal';
import { ProjectDetails } from '@/components/features/projects/onboarding/ProjectDetails';
import { GitHubDisconnectDialog } from '@/components/features/github/module/GitHubDisconnectDialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Github, Folder, AlertTriangle, Loader2 } from "lucide-react";
import { GitHubManagementTab } from "./GitHubManagementTab";
import { useState, useEffect, Suspense, lazy } from "react";
import { ErrorMessage } from "@/components/ui/error-message";
import { GitHubErrorBoundary } from '@/components/features/projects/onboarding/GitHubErrorBoundary';

interface ProjectOverviewProps {
  className?: string;
  isCompact?: boolean;
}

// Fallback component for the GitHub tab
const GitHubTabFallback = () => (
  <div className="flex-1 flex items-center justify-center p-8">
    <div className="text-center">
      <Loader2 className="h-8 w-8 mx-auto mb-3 animate-spin text-neon-blue/50" />
      <p className="text-muted-foreground">
        Loading GitHub tab...
      </p>
    </div>
  </div>
);

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
    linkedAccounts,
    handleAddProject,
    handleGitHubConnect,
    handleImportProject,
    handleOpenImportModal,
    handleDeleteProject,
    connectGitHub,
    disconnectGitHub,
    checkConnectionStatus,
    setActiveProject
  } = useProjectOverview();
  
  const [activeTab, setActiveTab] = useState("projects");
  const [tabError, setTabError] = useState<string | null>(null);
  const [isGithubTabMounted, setIsGithubTabMounted] = useState(false);
  
  // Handle tab changes safely
  const handleTabChange = (tab: string) => {
    try {
      setTabError(null);
      
      // Only mount GitHub tab when selected
      if (tab === "github") {
        setIsGithubTabMounted(true);
      }
      
      setActiveTab(tab);
    } catch (error) {
      console.error("Tab change error:", error);
      setTabError("Failed to switch tabs. Please try again.");
    }
  };
  
  // Clear error when component remounts or key dependencies change
  useEffect(() => {
    setTabError(null);
  }, [isConnected, githubUsername]);
  
  return (
    <div className={cn(
      "flex flex-col h-full", 
      "bg-gradient-to-br from-dark-lighter/30 to-transparent backdrop-blur-md",
      "border-neon-blue/20",
      className
    )}
    style={{ position: 'relative', zIndex: 'var(--z-projecthub)' }}
    >
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
      
      {tabError && (
        <div className="px-4 mt-2">
          <ErrorMessage message={tabError} />
        </div>
      )}
      
      <Tabs 
        value={activeTab} 
        onValueChange={handleTabChange} 
        className="flex-1 flex flex-col"
      >
        <TabsList className="mx-4 bg-background/30 border border-neon-blue/20">
          <TabsTrigger 
            value="projects" 
            className="flex items-center gap-1 data-[state=active]:bg-neon-blue/10"
          >
            <Folder className="h-4 w-4" />
            <span>Projects</span>
          </TabsTrigger>
          <TabsTrigger 
            value="github" 
            className="flex items-center gap-1 data-[state=active]:bg-neon-blue/10"
          >
            <Github className="h-4 w-4" />
            <span>GitHub</span>
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="projects" className="flex-1 flex flex-col mt-0 data-[state=inactive]:hidden">
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
        </TabsContent>
        
        <TabsContent value="github" className="flex-1 flex flex-col mt-0 data-[state=inactive]:hidden">
          <GitHubErrorBoundary>
            {isGithubTabMounted && (
              <GitHubManagementTab 
                isConnected={isConnected}
                githubUsername={githubUsername}
                connectGitHub={handleGitHubConnect}
                disconnectGitHub={() => setIsDisconnectDialogOpen(true)}
                isChecking={isChecking}
                checkConnectionStatus={checkConnectionStatus}
                linkedAccounts={linkedAccounts}
                error={errorMessage}
              />
            )}
          </GitHubErrorBoundary>
        </TabsContent>
      </Tabs>
      
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
