
import { useUIStore } from "@/stores";
import { cn } from "@/lib/utils";
import { useState, useEffect } from "react";
import { useGitHubConnection } from "@/hooks/useGitHubConnection";
import { GitHubStatusSection } from "@/components/github/GitHubStatusSection";
import { GitHubConnectDialog } from "@/components/github/GitHubConnectDialog";
import { ProjectList } from "@/components/projects/ProjectList";
import { ProjectDetails } from "@/components/projects/ProjectDetails";
import { ProjectActions } from "@/components/projects/ProjectActions";
import { GitHubImportModal } from "@/components/github/GitHubImportModal";
import { ProjectIndexingStatus } from "@/components/projects/ProjectIndexingStatus";
import { useAuthStore } from "@/stores/auth";
import { supabase } from "@/integrations/supabase/client";

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
  
  const { user } = useAuthStore();
  const [isConnectDialogOpen, setIsConnectDialogOpen] = useState(false);
  const [isImportModalOpen, setIsImportModalOpen] = useState(false);
  const [isIndexing, setIsIndexing] = useState(false);
  const [recentlyImportedProject, setRecentlyImportedProject] = useState<{
    id: string;
    repoName: string;
  } | null>(null);
  
  const {
    isConnected,
    isChecking,
    connectionStatus,
    connectGitHub,
    disconnectGitHub
  } = useGitHubConnection();
  
  const activeProject = projects.find(p => p.id === activeProjectId);
  
  useEffect(() => {
    // Check for newly imported projects with RAG indexing in progress
    if (activeProjectId && isConnected) {
      checkIndexingStatus(activeProjectId);
    }
  }, [activeProjectId, isConnected]);
  
  const checkIndexingStatus = async (projectId: string) => {
    if (!user?.id) return;
    
    try {
      // Check if there are recent vector entries for this project
      const { data: vectors } = await supabase
        .from('project_vectors')
        .select('created_at')
        .eq('project_id', projectId)
        .order('created_at', { ascending: false })
        .limit(1);
      
      if (vectors && vectors.length > 0) {
        // If vectors were created in the last 5 minutes, consider it as indexing
        const vectorCreatedAt = new Date(vectors[0].created_at);
        const fiveMinutesAgo = new Date(Date.now() - 5 * 60 * 1000);
        
        if (vectorCreatedAt > fiveMinutesAgo) {
          setIsIndexing(true);
          
          // Get project details from Supabase to show repo name
          const { data: project } = await supabase
            .from('projects')
            .select('github_repo')
            .eq('id', projectId)
            .single();
          
          if (project?.github_repo) {
            const repoName = project.github_repo.split('/').pop() || '';
            setRecentlyImportedProject({ id: projectId, repoName });
          }
          
          // Reset after some time (simulating completion)
          setTimeout(() => {
            setIsIndexing(false);
            setRecentlyImportedProject(null);
          }, 15000);
        }
      }
    } catch (error) {
      console.error("Error checking indexing status:", error);
    }
  };
  
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
  
  const handleImportProject = (projectId: string) => {
    setActiveProject(projectId);
    
    // For demo purposes, let's simulate RAG indexing
    setIsIndexing(true);
    
    // Fetch the project from Supabase to get the repo name
    const fetchProjectDetails = async () => {
      if (!user?.id) return;
      
      try {
        const { data: project } = await supabase
          .from('projects')
          .select('github_repo')
          .eq('id', projectId)
          .single();
          
        if (project?.github_repo) {
          const repoName = project.github_repo.split('/').pop() || '';
          setRecentlyImportedProject({ id: projectId, repoName });
        }
      } catch (error) {
        console.error("Error fetching project details:", error);
      }
    };
    
    fetchProjectDetails();
    
    // Reset after some time (simulating completion)
    setTimeout(() => {
      setIsIndexing(false);
      setRecentlyImportedProject(null);
    }, 15000);
  };

  // Extract username from metadata if available
  const githubUsername = connectionStatus.metadata?.username || null;
  // Extract error message if available
  const errorMessage = connectionStatus.errorMessage || null;
  
  return (
    <div className={cn("flex flex-col h-full", className)}>
      <div className="p-4 border-b border-neon-blue/20">
        <h2 className="text-neon-blue font-medium text-xl">Project Hub</h2>
      </div>
      
      <GitHubStatusSection
        isConnected={isConnected}
        username={githubUsername}
        isCheckingConnection={isChecking}
        onConnect={handleGitHubConnect}
        onDisconnect={disconnectGitHub}
        connectionStatus={connectionStatus.status === "connected" ? "connected" : 
                          connectionStatus.status === "pending" ? "connecting" : 
                          connectionStatus.status === "error" ? "error" : "idle"}
      />
      
      {isIndexing && recentlyImportedProject && (
        <div className="p-4">
          <ProjectIndexingStatus 
            projectId={recentlyImportedProject.id} 
            repoName={recentlyImportedProject.repoName}
          />
        </div>
      )}
      
      <div className="flex-1 overflow-auto">
        {activeProject ? (
          <ProjectDetails
            project={activeProject}
            isGithubConnected={isConnected}
            githubUsername={githubUsername}
          />
        ) : (
          <div className="flex flex-col items-center justify-center h-full p-4 space-y-6">
            <div className="text-center space-y-2">
              <h3 className="text-lg font-medium">No Project Selected</h3>
              <p className="text-sm text-muted-foreground">Create a new project or select one from the list below</p>
            </div>
            
            <ProjectActions 
              onAddProject={handleAddProject} 
              onImportProject={handleImportProject}
            />
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
        connectionStatus={connectionStatus.status === "connected" ? "connected" : 
                          connectionStatus.status === "pending" ? "connecting" : 
                          connectionStatus.status === "error" ? "error" : "idle"}
      />
      
      <GitHubImportModal
        isOpen={isImportModalOpen}
        onClose={() => setIsImportModalOpen(false)}
        onImportComplete={handleImportProject}
      />
    </div>
  );
}
