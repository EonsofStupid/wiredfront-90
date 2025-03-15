
import { useState } from "react";
import { RAGTierService } from "@/services/rag/RAGTierService";
import { toast } from "sonner";
import { logger } from "@/services/chat/LoggingService";

export function useRAGTier() {
  const [isPremiumAvailable, setIsPremiumAvailable] = useState<boolean>(false);
  const [isUpgrading, setIsUpgrading] = useState<boolean>(false);
  
  // Check if the user can use premium RAG features
  const checkPremiumStatus = async () => {
    try {
      const canUsePremium = await RAGTierService.canUsePremiumRAG();
      setIsPremiumAvailable(canUsePremium);
      return canUsePremium;
    } catch (error) {
      logger.error("Error checking premium RAG status:", error);
      return false;
    }
  };
  
  // Upgrade the user to premium RAG tier
  const upgradeToRagPremium = async () => {
    setIsUpgrading(true);
    try {
      const success = await RAGTierService.upgradeToRagPremium();
      
      if (success) {
        setIsPremiumAvailable(true);
        toast.success("Successfully upgraded to premium RAG tier");
        logger.info("User upgraded to premium RAG tier");
      } else {
        toast.error("Failed to upgrade to premium RAG tier");
        logger.error("Failed to upgrade to premium RAG tier");
      }
      
      return success;
    } catch (error) {
      logger.error("Error upgrading to premium RAG tier:", error);
      toast.error("Error upgrading to premium RAG tier");
      return false;
    } finally {
      setIsUpgrading(false);
    }
  };
  
  // Check if a project should be migrated to premium tier
  const checkMigrationStatus = async (projectId: string) => {
    try {
      const shouldMigrate = await RAGTierService.shouldMigrateToPreium(projectId);
      
      if (shouldMigrate && !isPremiumAvailable) {
        toast.info("Your project would benefit from premium RAG features. Consider upgrading.");
      }
      
      return shouldMigrate;
    } catch (error) {
      logger.error("Error checking migration status:", error);
      return false;
    }
  };
  
  // Add the missing migrateProjectToPremium method
  const migrateProjectToPremium = async (projectId: string) => {
    setIsUpgrading(true);
    try {
      const success = await RAGTierService.migrateProjectToPremium(projectId);
      
      if (success) {
        setIsPremiumAvailable(true);
        toast.success("Project successfully migrated to premium RAG tier");
        logger.info(`Project ${projectId} migrated to premium RAG tier`);
      } else {
        toast.error("Failed to migrate project to premium RAG tier");
        logger.error(`Failed to migrate project ${projectId} to premium RAG tier`);
      }
      
      return success;
    } catch (error) {
      logger.error(`Error migrating project ${projectId} to premium RAG tier:`, error);
      toast.error("Error migrating project to premium RAG tier");
      return false;
    } finally {
      setIsUpgrading(false);
    }
  };
  
  return {
    isPremiumAvailable,
    isUpgrading,
    checkPremiumStatus,
    upgradeToRagPremium,
    checkMigrationStatus,
    migrateProjectToPremium
  };
}
