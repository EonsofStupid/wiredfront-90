
import { useQuery } from "@tanstack/react-query";
import { RAGTierService } from "@/services/rag/RAGTierService";
import { RAGMetricsService } from "@/services/rag/RAGMetricsService";
import { RAGTier } from "@/services/rag/types";
import { ragUtils } from "./ragUtils";

/**
 * Hook for fetching and managing RAG metrics
 */
export function useRAGMetrics() {
  // Get user's RAG metrics and limits
  const { 
    data: ragInfo, 
    isLoading: isLoadingRAGInfo,
    error: ragInfoError,
    refetch: refetchRAGInfo
  } = useQuery({
    queryKey: ['rag-info'],
    queryFn: () => RAGMetricsService.getUserRAGMetrics(),
    refetchOnWindowFocus: false,
  });
  
  // Check if premium RAG is available
  const {
    data: isPremiumAvailable,
    isLoading: isCheckingPremium
  } = useQuery({
    queryKey: ['premium-rag-available'],
    queryFn: () => RAGTierService.canUsePremiumRAG(),
    refetchOnWindowFocus: false,
  });

  return {
    // RAG info
    ragInfo,
    isLoadingRAGInfo,
    ragInfoError,
    refetchRAGInfo,
    
    // Premium status
    isPremiumAvailable,
    isCheckingPremium,
    
    // Utilities
    getCurrentTier: () => ragInfo?.tier || 'standard' as RAGTier,
    isAtVectorLimit: () => {
      if (!ragInfo) return false;
      return ragUtils.isAtVectorLimit(
        ragInfo.metrics.vectorCount, 
        ragInfo.limits.maxVectors
      );
    },
    getUsagePercentage: () => {
      if (!ragInfo || !ragInfo.limits.maxVectors) return 0;
      return ragUtils.calculateUsagePercentage(
        ragInfo.metrics.vectorCount, 
        ragInfo.limits.maxVectors
      );
    }
  };
}
