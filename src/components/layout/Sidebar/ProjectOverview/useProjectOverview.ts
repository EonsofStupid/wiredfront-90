
import { useState } from "react";
import { useGitHubConnection } from "@/hooks/github/useGitHubConnection";
import { supabase } from "@/integrations/supabase/client";
import { useAuthStore } from "@/stores/auth";
import { logger } from "@/services/chat/LoggingService";
import { toast } from "sonner";
import { GitHubConnectionStatusProps } from "@/types/admin/settings/github";
import { useProjects } from "@/hooks/projects/useProjects";
import { ProjectCreateDTO } from "@/services/projects/ProjectService";

export function useProjectOverview() {
  const { user } = useAuthStore();
  const {
    projects,
    activeProject,
    activeProjectId,
    isLoadingProjects,
    createProject,
    setActiveProject,
    deleteProject
  } = useProjects();
  
  const [isConnectDialogOpen, setIsConnectDialogOpen] = useState(false);
  const [isDisconnectDialogOpen, setIsDisconnectDialogOpen] = useState(false);
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
    disconnectGitHub,
    checkConnectionStatus
  } = useGitHubConnection();
  
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
  
  const handleAddProject = async () => {
    logger.info("New project button clicked");
    
    const projectData: ProjectCreateDTO = {
      name: `New Project ${(projects?.length || 0) + 1}`,
      description: "Add a description"
    };
    
    await createProject(projectData);
  };

  const handleGitHubConnect = () => {
    logger.info("GitHub connect button clicked");
    setIsConnectDialogOpen(true);
  };
  
  const handleImportProject = (projectId: string) => {
    logger.info("Project import completed", { projectId });
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

  const handleOpenImportModal = () => {
    logger.info("Import from GitHub button clicked");
    
    if (!isConnected) {
      logger.warn("GitHub import attempted without connection");
      toast.error("You need to connect your GitHub account first");
      return;
    }
    
    setIsImportModalOpen(true);
  };

  const handleDeleteProject = async (projectId: string) => {
    logger.info("Delete project button clicked", { projectId });
    await deleteProject(projectId);
  };

  // Extract username from metadata if available
  const githubUsername = connectionStatus.metadata && 
    connectionStatus.metadata.username ? connectionStatus.metadata.username : null;
    
  // Extract error message if available
  const errorMessage = connectionStatus.errorMessage;

  return {
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
    checkConnectionStatus,
    setActiveProject
  };
}
