
import { useState, useEffect } from "react";
import { useUIStore } from "@/stores";
import { useGitHubConnection } from "@/hooks/useGitHubConnection";
import { supabase } from "@/integrations/supabase/client";
import { useAuthStore } from "@/stores/auth";
import { logger } from "@/services/chat/LoggingService";

export function useProjectOverview() {
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
    logger.info("New project button clicked");
    addProject({
      name: `New Project ${projects.length + 1}`,
      description: "Add a description",
      lastModified: new Date(),
    });
  };

  const handleGitHubConnect = () => {
    logger.info("GitHub connect button clicked");
    setIsConnectDialogOpen(true);
    connectGitHub();
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
      setIsConnectDialogOpen(true);
      return;
    }
    
    setIsImportModalOpen(true);
  };

  // Extract username from metadata if available
  const githubUsername = connectionStatus.metadata?.username || null;
  // Extract error message if available
  const errorMessage = connectionStatus.errorMessage || null;

  // Map connectionStatus to a simpler format for the component
  const mappedStatus: 'idle' | 'connecting' | 'connected' | 'error' = 
    connectionStatus.status === "connected" ? "connected" : 
    connectionStatus.status === "pending" ? "connecting" : 
    connectionStatus.status === "error" ? "error" : "idle";

  return {
    projects,
    activeProject,
    activeProjectId,
    isConnected,
    isChecking,
    connectionStatus: mappedStatus,
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
  };
}
