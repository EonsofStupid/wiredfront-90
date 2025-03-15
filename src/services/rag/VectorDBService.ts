
import { VectorSearchService } from "./VectorSearchService";
import { VectorStatsService } from "./VectorStatsService";
import { VectorMigrationService } from "./VectorMigrationService";
import { VectorManagementService } from "./VectorManagementService";
import { 
  VectorDBStats, 
  SearchQuery, 
  SearchResult, 
  VectorLimitStatus 
} from "./types";

/**
 * Service that provides access to vector database operations
 * Acts as a facade for more specialized services
 */
export class VectorDBService {
  /**
   * Get the vector database type for the current user
   */
  static async getVectorDBType(): Promise<'supabase' | 'pinecone'> {
    return VectorSearchService.getVectorDBType();
  }
  
  /**
   * Get statistics about the vector database for a project
   */
  static async getProjectVectorStats(projectId: string): Promise<VectorDBStats> {
    return VectorStatsService.getProjectVectorStats(projectId);
  }
  
  /**
   * Search vectors for a given query
   */
  static async search(query: SearchQuery): Promise<SearchResult[]> {
    return VectorSearchService.search(query);
  }
  
  /**
   * Delete vectors for a project
   */
  static async deleteProjectVectors(projectId: string): Promise<boolean> {
    return VectorManagementService.deleteProjectVectors(projectId);
  }
  
  /**
   * Migrate vectors from Supabase to Pinecone (for tier upgrades)
   */
  static async migrateVectors(projectId: string): Promise<boolean> {
    return VectorMigrationService.migrateVectors(projectId);
  }
  
  /**
   * Check if a project is at or near vector limit
   */
  static async isProjectAtVectorLimit(projectId: string): Promise<VectorLimitStatus> {
    return VectorStatsService.isProjectAtVectorLimit(projectId);
  }
  
  /**
   * Get all vectors for a project
   */
  static async getProjectVectors(projectId: string, limit = 100): Promise<any[]> {
    return VectorStatsService.getProjectVectors(projectId, limit);
  }
}
