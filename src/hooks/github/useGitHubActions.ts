
import { logger } from "@/services/chat/LoggingService";
import { toast } from "sonner";

/**
 * Hook for GitHub-related actions
 */
export function useGitHubActions(setIsConnectDialogOpen: (isOpen: boolean) => void, setIsImportModalOpen: (isOpen: boolean) => void) {
  const handleGitHubConnect = () => {
    try {
      logger.info("GitHub connect button clicked");
      setIsConnectDialogOpen(true);
    } catch (error) {
      console.error("Error handling GitHub connect:", error);
      toast.error("Failed to open GitHub connect dialog");
    }
  };

  const handleOpenImportModal = (isConnected: boolean) => {
    try {
      logger.info("Import from GitHub button clicked");
      
      if (!isConnected) {
        logger.warn("GitHub import attempted without connection");
        toast.error("You need to connect your GitHub account first");
        return;
      }
      
      setIsImportModalOpen(true);
    } catch (error) {
      console.error("Error opening import modal:", error);
      toast.error("Failed to open import modal");
    }
  };

  return {
    handleGitHubConnect,
    handleOpenImportModal
  };
}
