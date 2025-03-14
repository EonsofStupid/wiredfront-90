
import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { RAGService, RAGTier } from "@/services/rag/RAGService";
import { VectorDBService } from "@/services/rag/VectorDBService";
import { logger } from "@/services/chat/LoggingService";

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
  
  // Upgrade to premium RAG mutation
  const upgradeMutation = useMutation({
    mutationFn: () => RAGService.upgradeToRagPremium(),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['rag-info'] });
      queryClient.invalidateQueries({ queryKey: ['premium-rag-available'] });
    }
  });
  
  // Index project mutation
  const indexMutation = useMutation({
    mutationFn: (pid: string) => RAGService.indexProject(pid),
    onSuccess: () => {
      if (projectId) {
        queryClient.invalidateQueries({ queryKey: ['project-vector-stats', projectId] });
      }
    }
  });
  
  // Migrate vectors mutation (from Supabase to Pinecone)
  const migrateMutation = useMutation({
    mutationFn: (pid: string) => VectorDBService.migrateVectors(pid),
    onSuccess: () => {
      if (projectId) {
        queryClient.invalidateQueries({ queryKey: ['project-vector-stats', projectId] });
      }
    }
  });
  
  // Delete vectors mutation
  const deleteMutation = useMutation({
    mutationFn: (pid: string) => VectorDBService.deleteProjectVectors(pid),
    onSuccess: () => {
      if (projectId) {
        queryClient.invalidateQueries({ queryKey: ['project-vector-stats', projectId] });
      }
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
      return [];
    } finally {
      setIsSearching(false);
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
    
    // Operations
    upgradeToRagPremium: upgradeMutation.mutate,
    isUpgrading: upgradeMutation.isPending,
    
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
