
import { supabase } from "@/integrations/supabase/client";
import { logger } from "@/services/chat/LoggingService";
import { toast } from "sonner";
import { RAGService } from "./RAGService";

export interface VectorDBStats {
  totalVectors: number;
  usedStorage: number;
  lastIndexed: string | null;
}

export interface SearchQuery {
  text: string;
  projectId?: string;
  limit?: number;
  filters?: Record<string, any>;
}

export interface SearchResult {
  content: string;
  metadata: any;
  score: number;
  source: string;
}

export class VectorDBService {
  /**
   * Get the vector database type for the current user
   */
  static async getVectorDBType(): Promise<'supabase' | 'pinecone'> {
    try {
      const isPremium = await RAGService.canUsePremiumRAG();
      return isPremium ? 'pinecone' : 'supabase';
    } catch (error) {
      logger.error("Error determining vector DB type:", error);
      return 'supabase'; // Default to supabase
    }
  }
  
  /**
   * Get statistics about the vector database for a project
   */
  static async getProjectVectorStats(projectId: string): Promise<VectorDBStats> {
    try {
      const dbType = await this.getVectorDBType();
      
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
   * Search vectors for a given query
   */
  static async search(query: SearchQuery): Promise<SearchResult[]> {
    try {
      const dbType = await this.getVectorDBType();
      
      // Use the appropriate search method based on the vector DB type
      const { data, error } = await supabase.functions.invoke('vector-search', {
        body: {
          query: query.text,
          projectId: query.projectId,
          limit: query.limit || 5,
          filters: query.filters || {},
          vectorDbType: dbType
        }
      });
      
      if (error) throw error;
      
      // Track this search query for analytics
      if (query.projectId) {
        await RAGService.trackRAGUsage('query', query.projectId, {
          tokensUsed: query.text.split(/\s+/).length
        });
      }
      
      return data.results || [];
    } catch (error) {
      logger.error("Vector search error:", error);
      toast.error("Error performing search");
      return [];
    }
  }
  
  /**
   * Delete vectors for a project
   */
  static async deleteProjectVectors(projectId: string): Promise<boolean> {
    try {
      const dbType = await this.getVectorDBType();
      
      if (dbType === 'supabase') {
        // For Supabase, we can directly delete from the database
        const { error } = await supabase
          .from('project_vectors')
          .delete()
          .eq('project_id', projectId);
          
        if (error) throw error;
      } else {
        // For Pinecone, we need to use the edge function
        const { error } = await supabase.functions.invoke('vector-management', {
          body: {
            action: 'delete-project-vectors',
            projectId,
            vectorDbType: 'pinecone'
          }
        });
        
        if (error) throw error;
      }
      
      toast.success("Project vectors deleted successfully");
      return true;
    } catch (error) {
      logger.error("Error deleting project vectors:", error);
      toast.error("Failed to delete project vectors");
      return false;
    }
  }
  
  /**
   * Migrate vectors from Supabase to Pinecone (for tier upgrades)
   */
  static async migrateVectors(projectId: string): Promise<boolean> {
    try {
      // This operation is only needed when upgrading from standard to premium
      const isPremium = await RAGService.canUsePremiumRAG();
      if (!isPremium) {
        toast.error("Premium tier required for Pinecone integration");
        return false;
      }
      
      // Start the migration process using an edge function
      const { error } = await supabase.functions.invoke('vector-migration', {
        body: { projectId }
      });
      
      if (error) throw error;
      
      toast.success("Vector migration started. This may take some time to complete.");
      return true;
    } catch (error) {
      logger.error("Error migrating vectors:", error);
      toast.error("Failed to migrate vectors");
      return false;
    }
  }
}
