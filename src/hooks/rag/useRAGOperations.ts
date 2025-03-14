
import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { RAGService, RAGTier } from "@/services/rag/RAGService";
import { VectorDBService } from "@/services/rag/VectorDBService";
import { logger } from "@/services/chat/LoggingService";
import { toast } from "sonner";

export function useRAGOperations(projectId?: string) {
  const queryClient = useQueryClient();
  const [searchTerm, setSearchTerm] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  
  // Get user's RAG metrics and limits
  const { 
    data: ragInfo, 
    isLoading: isLoadingRAGInfo,
    error: ragInfoError,
    refetch: refetchRAGInfo
  } = useQuery({
    queryKey: ['rag-info'],
    queryFn: () => RAGService.getUserRAGMetrics(),
    refetchOnWindowFocus: false,
  });
  
  // Get project vector stats if projectId is provided
  const {
    data: vectorStats,
    isLoading: isLoadingVectorStats,
    error: vectorStatsError,
    refetch: refetchVectorStats
  } = useQuery({
    queryKey: ['project-vector-stats', projectId],
    queryFn: () => projectId ? VectorDBService.getProjectVectorStats(projectId) : Promise.resolve(null),
    enabled: !!projectId,
    refetchOnWindowFocus: false,
  });
  
  // Check if premium RAG is available
  const {
    data: isPremiumAvailable,
    isLoading: isCheckingPremium
  } = useQuery({
    queryKey: ['premium-rag-available'],
    queryFn: () => RAGService.canUsePremiumRAG(),
    refetchOnWindowFocus: false,
  });

  // Check if project should be migrated to premium
  const {
    data: shouldMigrate,
    isLoading: isCheckingMigration
  } = useQuery({
    queryKey: ['should-migrate-project', projectId],
    queryFn: () => projectId ? RAGService.shouldMigrateToPreium(projectId) : Promise.resolve(false),
    enabled: !!projectId && !isPremiumAvailable,
    refetchOnWindowFocus: false,
  });
  
  // Get vector limit status
  const {
    data: vectorLimitStatus,
    isLoading: isCheckingVectorLimit
  } = useQuery({
    queryKey: ['vector-limit-status', projectId],
    queryFn: () => projectId ? VectorDBService.isProjectAtVectorLimit(projectId) : Promise.resolve({
      atLimit: false,
      usagePercentage: 0,
      vectorCount: 0,
      maxVectors: 0
    }),
    enabled: !!projectId,
    refetchOnWindowFocus: false,
  });
  
  // Upgrade to premium RAG mutation
  const upgradeMutation = useMutation({
    mutationFn: () => RAGService.upgradeToRagPremium(),
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
  const migrateMutation = useMutation({
    mutationFn: (pid: string) => RAGService.migrateProjectToPremium(pid),
    onSuccess: () => {
      if (projectId) {
        queryClient.invalidateQueries({ queryKey: ['project-vector-stats', projectId] });
        queryClient.invalidateQueries({ queryKey: ['vector-limit-status', projectId] });
        queryClient.invalidateQueries({ queryKey: ['should-migrate-project', projectId] });
        queryClient.invalidateQueries({ queryKey: ['premium-rag-available'] });
      }
      toast.success("Project successfully migrated to Premium tier");
    },
    onError: (error) => {
      logger.error("Migration error:", error);
      toast.error("Failed to migrate project to Premium tier");
    }
  });
  
  // Index project mutation
  const indexMutation = useMutation({
    mutationFn: (pid: string) => RAGService.indexProject(pid),
    onSuccess: () => {
      if (projectId) {
        queryClient.invalidateQueries({ queryKey: ['project-vector-stats', projectId] });
        toast.success("Project indexing initiated");
      }
    },
    onError: (error) => {
      logger.error("Indexing error:", error);
      toast.error("Failed to index project");
    }
  });
  
  // Migrate vectors mutation (from Supabase to Pinecone)
  const migrateMutation = useMutation({
    mutationFn: (pid: string) => VectorDBService.migrateVectors(pid),
    onSuccess: () => {
      if (projectId) {
        queryClient.invalidateQueries({ queryKey: ['project-vector-stats', projectId] });
        toast.success("Vector migration completed");
      }
    },
    onError: (error) => {
      logger.error("Vector migration error:", error);
      toast.error("Failed to migrate vectors");
    }
  });
  
  // Delete vectors mutation
  const deleteMutation = useMutation({
    mutationFn: (pid: string) => VectorDBService.deleteProjectVectors(pid),
    onSuccess: () => {
      if (projectId) {
        queryClient.invalidateQueries({ queryKey: ['project-vector-stats', projectId] });
        toast.success("Project vectors deleted successfully");
      }
    },
    onError: (error) => {
      logger.error("Delete vectors error:", error);
      toast.error("Failed to delete project vectors");
    }
  });
  
  // Perform vector search
  const performSearch = async (query: string, filters?: Record<string, any>) => {
    if (!query.trim()) return [];
    
    try {
      setIsSearching(true);
      
      const results = await VectorDBService.search({
        text: query,
        projectId,
        limit: 10,
        filters
      });
      
      return results;
    } catch (error) {
      logger.error("Search error:", error);
      toast.error("Search failed");
      return [];
    } finally {
      setIsSearching(false);
    }
  };

  // Handle upgrade prompt for project
  const handleUpgradePrompt = () => {
    if (vectorLimitStatus?.usagePercentage > 85) {
      toast({
        title: "Project approaching vector limit",
        description: `Your project is using ${vectorLimitStatus.usagePercentage.toFixed(1)}% of available vector storage. Consider upgrading to Premium.`,
        action: {
          label: "Upgrade",
          onClick: () => migrateMutation.mutate(projectId!)
        }
      });
    }
  };
  
  return {
    // RAG info
    ragInfo,
    isLoadingRAGInfo,
    ragInfoError,
    refetchRAGInfo,
    
    // Vector stats
    vectorStats,
    isLoadingVectorStats,
    vectorStatsError,
    refetchVectorStats,
    
    // Premium status
    isPremiumAvailable,
    isCheckingPremium,
    shouldMigrate,
    isCheckingMigration,
    
    // Vector limits
    vectorLimitStatus,
    isCheckingVectorLimit,
    handleUpgradePrompt,
    
    // Operations
    upgradeToRagPremium: upgradeMutation.mutate,
    isUpgrading: upgradeMutation.isPending,
    
    migrateProjectToPremium: migrateMutation.mutate,
    isMigratingProject: migrateMutation.isPending,
    
    indexProject: indexMutation.mutate,
    isIndexing: indexMutation.isPending,
    
    migrateVectors: migrateMutation.mutate,
    isMigrating: migrateMutation.isPending,
    
    deleteVectors: deleteMutation.mutate,
    isDeleting: deleteMutation.isPending,
    
    // Search
    searchTerm,
    setSearchTerm,
    performSearch,
    isSearching,
    
    // Utilities
    getCurrentTier: () => ragInfo?.tier || 'standard',
    isAtVectorLimit: () => {
      if (!ragInfo) return false;
      return ragInfo.metrics.vectorCount >= ragInfo.limits.maxVectors;
    },
    getUsagePercentage: () => {
      if (!ragInfo || !ragInfo.limits.maxVectors) return 0;
      return Math.round((ragInfo.metrics.vectorCount / ragInfo.limits.maxVectors) * 100);
    }
  };
}
