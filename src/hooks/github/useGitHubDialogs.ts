
import { useState } from "react";

/**
 * Hook for managing GitHub connection dialog states
 */
export function useGitHubDialogs() {
  const [isConnectDialogOpen, setIsConnectDialogOpen] = useState(false);
  const [isDisconnectDialogOpen, setIsDisconnectDialogOpen] = useState(false);
  const [isImportModalOpen, setIsImportModalOpen] = useState(false);
  
  return {
    isConnectDialogOpen,
    setIsConnectDialogOpen,
    isDisconnectDialogOpen, 
    setIsDisconnectDialogOpen,
    isImportModalOpen,
    setIsImportModalOpen
  };
}
