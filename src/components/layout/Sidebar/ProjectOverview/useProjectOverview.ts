
import { useGitHubConnection } from "@/hooks/github/useGitHubConnection";
import { useProjects } from "@/hooks/projects/useProjects";
import { useGitHubDialogs } from "@/hooks/github/useGitHubDialogs";
import { useProjectIndexing } from "@/hooks/projects/useProjectIndexing";
import { useProjectActions } from "@/hooks/projects/useProjectActions";
import { useGitHubActions } from "@/hooks/github/useGitHubActions";

/**
 * Main hook combining all project overview functionality
 */
export function useProjectOverview() {
  // Get existing hooks
  const {
    projects,
    activeProject,
    activeProjectId,
    isLoadingProjects
  } = useProjects();
  
  // Dialog management
  const {
    isConnectDialogOpen,
    setIsConnectDialogOpen,
    isDisconnectDialogOpen, 
    setIsDisconnectDialogOpen,
    isImportModalOpen,
    setIsImportModalOpen
  } = useGitHubDialogs();
  
  // GitHub connection
  const {
    isConnected,
    isChecking,
    connectionStatus,
    githubUsername,
    linkedAccounts,
    connectGitHub,
    disconnectGitHub,
    checkConnectionStatus
  } = useGitHubConnection();
  
  // Project indexing
  const {
    isIndexing,
    recentlyImportedProject,
    simulateIndexing
  } = useProjectIndexing();
  
  // Project actions
  const {
    handleAddProject,
    handleImportProject,
    handleDeleteProject,
    setActiveProject
  } = useProjectActions();
  
  // GitHub actions
  const {
    handleGitHubConnect,
    handleOpenImportModal
  } = useGitHubActions(setIsConnectDialogOpen, setIsImportModalOpen);
  
  // Handle import project with indexing simulation
  const handleProjectImport = (projectId: string) => {
    const result = handleImportProject(projectId);
    if (result) {
      simulateIndexing(projectId);
    }
  };

  // Extract error message if available
  const errorMessage = connectionStatus.errorMessage;

  return {
    // Project data
    projects,
    activeProject,
    activeProjectId,
    isLoadingProjects,
    
    // GitHub connection data
    isConnected,
    isChecking,
    connectionStatus,
    githubUsername,
    linkedAccounts,
    
    // Indexing status
    isIndexing,
    recentlyImportedProject,
    
    // Dialog states
    isConnectDialogOpen,
    setIsConnectDialogOpen,
    isDisconnectDialogOpen,
    setIsDisconnectDialogOpen,
    isImportModalOpen,
    setIsImportModalOpen,
    
    // Error handling
    errorMessage,
    
    // Actions
    handleAddProject,
    handleGitHubConnect,
    handleImportProject: handleProjectImport,
    handleOpenImportModal: () => handleOpenImportModal(isConnected),
    handleDeleteProject,
    connectGitHub,
    disconnectGitHub,
    checkConnectionStatus,
    setActiveProject
  };
}
