
import { useState } from "react";
import { VectorSearchService } from "@/services/rag/VectorSearchService";
import { logger } from "@/services/chat/LoggingService";
import { toast } from "sonner";

/**
 * Hook for managing vector search operations
 */
export function useVectorSearch(projectId?: string) {
  const [searchTerm, setSearchTerm] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  
  // Perform vector search
  const performSearch = async (query: string, filters?: Record<string, any>) => {
    if (!query.trim()) return [];
    
    try {
      setIsSearching(true);
      
      const results = await VectorSearchService.search({
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

  return {
    // Search
    searchTerm,
    setSearchTerm,
    performSearch,
    isSearching,
  };
}
