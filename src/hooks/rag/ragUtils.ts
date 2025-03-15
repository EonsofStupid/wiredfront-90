
import { RAGTier } from "@/services/rag/types";

/**
 * Utility functions for RAG operations
 */
export const ragUtils = {
  /**
   * Calculate usage percentage based on vector count and max vectors
   */
  calculateUsagePercentage: (vectorCount: number, maxVectors: number): number => {
    if (!maxVectors) return 0;
    return Math.round((vectorCount / maxVectors) * 100);
  },

  /**
   * Check if vector usage is at limit (95% or higher)
   */
  isAtVectorLimit: (vectorCount: number, maxVectors: number): boolean => {
    if (!maxVectors) return false;
    return (vectorCount / maxVectors) >= 0.95; // 95% or higher
  },

  /**
   * Check if vector usage is approaching limit (85% or higher)
   */
  isApproachingLimit: (vectorCount: number, maxVectors: number): boolean => {
    if (!maxVectors) return false;
    return (vectorCount / maxVectors) >= 0.85; // 85% or higher
  }
};
