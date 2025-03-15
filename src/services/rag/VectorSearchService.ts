
import { supabase } from "@/integrations/supabase/client";
import { logger } from "@/services/chat/LoggingService";
import { toast } from "sonner";
import { RAGService } from "./RAGService";
import { SearchQuery, SearchResult } from "./types";

export class VectorSearchService {
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
}
