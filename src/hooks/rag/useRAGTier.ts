
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { RAGTierService } from "@/services/rag/RAGTierService";
import { RAGIndexingService } from "@/services/rag/RAGIndexingService";
import { logger } from "@/services/chat/LoggingService";
import { toast } from "sonner";
import { useRAGMetrics } from "./useRAGMetrics";

/**
 * Hook for managing RAG tier operations
 */
export function useRAGTier() {
  const queryClient = useQueryClient();
  const { isPremiumAvailable } = useRAGMetrics();
  
  // Upgrade to premium RAG mutation
  const upgradeMutation = useMutation({
    mutationFn: () => RAGTierService.upgradeToRagPremium(),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['rag-info'] });
      queryClient.invalidateQueries({ queryKey: ['premium-rag-available'] });
      toast.success("Successfully upgraded to Premium RAG tier");
    },
    onError: (error) => {
      logger.error("Upgrade error:", error);
      toast.error("Failed to upgrade to Premium RAG tier");
    }
  });
  
  // Migrate project to premium mutation
  const migrateToRagPremiumMutation = useMutation({
    mutationFn: (projectId: string) => RAGIndexingService.migrateProjectToPremium(projectId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['premium-rag-available'] });
      toast.success("Project successfully migrated to Premium tier");
    },
    onError: (error) => {
      logger.error("Migration error:", error);
      toast.error("Failed to migrate project to Premium tier");
    }
  });

  return {
    // Premium status
    isPremiumAvailable,
    
    // Operations
    upgradeToRagPremium: upgradeMutation.mutate,
    isUpgrading: upgradeMutation.isPending,
    
    migrateProjectToPremium: migrateToRagPremiumMutation.mutate,
    isMigratingProject: migrateToRagPremiumMutation.isPending,
  };
}
