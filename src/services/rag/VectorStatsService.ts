
import { supabase } from "@/integrations/supabase/client";
import { logger } from "@/services/chat/LoggingService";
import { RAGService } from "./RAGService";
import { VectorDBStats, VectorLimitStatus } from "./types";
import { VectorSearchService } from "./VectorSearchService";

export class VectorStatsService {
  /**
   * Get statistics about the vector database for a project
   */
  static async getProjectVectorStats(projectId: string): Promise<VectorDBStats> {
    try {
      const dbType = await VectorSearchService.getVectorDBType();
      
      if (dbType === 'supabase') {
        // For Supabase, we can directly query the database
        const { data, error } = await supabase
          .from('project_vectors')
          .select('id, created_at')
          .eq('project_id', projectId)
          .order('created_at', { ascending: false });
          
        if (error) throw error;
        
        return {
          totalVectors: data.length,
          usedStorage: data.length * 1536 * 4, // Rough estimate: 1536 dimensions * 4 bytes per float
          lastIndexed: data.length > 0 ? data[0].created_at : null
        };
      } else {
        // For Pinecone, we need to use the edge function
        const { data, error } = await supabase.functions.invoke('vector-db-stats', {
          body: { projectId, dbType }
        });
        
        if (error) throw error;
        
        return {
          totalVectors: data.stats.vectorCount || 0,
          usedStorage: data.stats.storageSize || 0,
          lastIndexed: data.stats.lastModified || null
        };
      }
    } catch (error) {
      logger.error("Error fetching vector stats:", error);
      return {
        totalVectors: 0,
        usedStorage: 0,
        lastIndexed: null
      };
    }
  }

  /**
   * Check if a project is at or near vector limit
   */
  static async isProjectAtVectorLimit(projectId: string): Promise<VectorLimitStatus> {
    try {
      // Get project vector stats
      const stats = await this.getProjectVectorStats(projectId);
      
      // Get user RAG metrics to determine limits
      const ragMetrics = await RAGService.getUserRAGMetrics();
      
      const usagePercentage = (stats.totalVectors / ragMetrics.limits.maxVectors) * 100;
      
      return {
        atLimit: usagePercentage >= 95, // At limit if usage is 95% or higher
        usagePercentage,
        vectorCount: stats.totalVectors,
        maxVectors: ragMetrics.limits.maxVectors
      };
    } catch (error) {
      logger.error("Error checking vector limits:", error);
      return {
        atLimit: false,
        usagePercentage: 0,
        vectorCount: 0,
        maxVectors: 10000
      };
    }
  }

  /**
   * Get all vectors for a project
   */
  static async getProjectVectors(projectId: string, limit = 100): Promise<any[]> {
    try {
      const dbType = await VectorSearchService.getVectorDBType();
      
      if (dbType === 'supabase') {
        // For Supabase, query the database directly
        const { data, error } = await supabase
          .from('project_vectors')
          .select('id, vector_data, created_at')
          .eq('project_id', projectId)
          .limit(limit);
          
        if (error) throw error;
        return data || [];
      } else {
        // For Pinecone, use the edge function
        const { data, error } = await supabase.functions.invoke('vector-management', {
          body: {
            action: 'get-project-vectors',
            projectId,
            limit
          }
        });
        
        if (error) throw error;
        return data.vectors || [];
      }
    } catch (error) {
      logger.error("Error fetching project vectors:", error);
      return [];
    }
  }
}
