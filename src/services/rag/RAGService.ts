
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { logger } from "@/services/chat/LoggingService";

export type RAGTier = 'standard' | 'premium';

interface RAGMetrics {
  vectorCount: number;
  queryCount: number;
  storageUsed: number;
  averageLatency: number;
}

export class RAGService {
  /**
   * Determine if a user can use premium RAG features
   */
  static async canUsePremiumRAG(): Promise<boolean> {
    try {
      // Check if user is authenticated
      const { data: { session } } = await supabase.auth.getSession();
      if (!session?.user) return false;
      
      // Fetch user's RAG settings
      const { data: userSettings, error } = await supabase
        .from('rag_user_settings')
        .select('tier')
        .eq('user_id', session.user.id)
        .single();
        
      if (error) {
        logger.error("Error checking RAG tier:", error);
        return false;
      }
      
      return userSettings?.tier === 'premium';
    } catch (error) {
      logger.error("Error checking premium RAG status:", error);
      return false;
    }
  }
  
  /**
   * Index a project's content with the appropriate RAG service based on user tier
   */
  static async indexProject(projectId: string): Promise<boolean> {
    try {
      const isPremium = await this.canUsePremiumRAG();
      const vectorStoreType = isPremium ? 'pinecone' : 'supabase';
      
      logger.info(`Indexing project with ${vectorStoreType} store`, { projectId });
      
      // Notify the indexing service of the project to be indexed
      const { data, error } = await supabase.functions.invoke('index-project', {
        body: { 
          projectId, 
          vectorStoreType 
        }
      });
      
      if (error) throw error;
      
      toast.success("Project indexing has started");
      return true;
    } catch (error) {
      logger.error("Project indexing error:", error);
      toast.error("Failed to index project");
      return false;
    }
  }
  
  /**
   * Get a user's RAG metrics and limits
   */
  static async getUserRAGMetrics(): Promise<{
    metrics: RAGMetrics;
    limits: {
      maxVectors: number;
      maxStorage: number;
      maxQueries: number;
    };
    tier: RAGTier;
  }> {
    try {
      // Get authenticated user
      const { data: { session } } = await supabase.auth.getSession();
      if (!session?.user) {
        throw new Error("User not authenticated");
      }
      
      // Fetch user settings
      const { data: userSettings, error: settingsError } = await supabase
        .from('rag_user_settings')
        .select('*')
        .eq('user_id', session.user.id)
        .single();
        
      if (settingsError) throw settingsError;
      
      // Fetch metrics
      const { data: metrics, error: metricsError } = await supabase
        .from('rag_metrics')
        .select('*')
        .eq('user_id', session.user.id)
        .single();
        
      if (metricsError && metricsError.code !== 'PGRST116') {
        throw metricsError;
      }
      
      return {
        metrics: {
          vectorCount: metrics?.vector_count || 0,
          queryCount: metrics?.query_count || 0,
          storageUsed: userSettings?.storage_used || 0,
          averageLatency: metrics?.average_latency || 0
        },
        limits: {
          maxVectors: userSettings?.max_vectors || 10000,
          maxStorage: userSettings?.max_storage || 100 * 1024 * 1024, // Default 100MB
          maxQueries: userSettings?.tier === 'premium' ? 1000 : 100 // Default query limits
        },
        tier: (userSettings?.tier || 'standard') as RAGTier
      };
    } catch (error) {
      logger.error("Error fetching RAG metrics:", error);
      // Return default values if there's an error
      return {
        metrics: { vectorCount: 0, queryCount: 0, storageUsed: 0, averageLatency: 0 },
        limits: { maxVectors: 10000, maxStorage: 100 * 1024 * 1024, maxQueries: 100 },
        tier: 'standard'
      };
    }
  }
  
  /**
   * Upgrade a user's RAG tier to premium
   */
  static async upgradeToRagPremium(): Promise<boolean> {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session?.user) {
        throw new Error("User not authenticated");
      }
      
      // Check if the user already has a RAG settings entry
      const { data: existing, error: queryError } = await supabase
        .from('rag_user_settings')
        .select('id')
        .eq('user_id', session.user.id)
        .maybeSingle();
        
      if (queryError) throw queryError;
      
      if (existing) {
        // Update existing settings
        const { error } = await supabase
          .from('rag_user_settings')
          .update({ 
            tier: 'premium',
            max_vectors: 100000, // 10x standard tier
            max_storage: 1024 * 1024 * 1024, // 1GB
            vectorstore_type: 'pinecone'
          })
          .eq('id', existing.id);
          
        if (error) throw error;
      } else {
        // Create new settings
        const { error } = await supabase
          .from('rag_user_settings')
          .insert({
            user_id: session.user.id,
            tier: 'premium',
            max_vectors: 100000,
            max_storage: 1024 * 1024 * 1024,
            vectorstore_type: 'pinecone',
            vectors_used: 0,
            queries_made: 0,
            storage_used: 0
          });
          
        if (error) throw error;
      }
      
      // Track upgrade in analytics
      await supabase
        .from('system_logs')
        .insert({
          level: 'info',
          source: 'rag_service',
          message: 'User upgraded to premium RAG tier',
          user_id: session.user.id,
          metadata: { previous_tier: 'standard', new_tier: 'premium' }
        });
      
      toast.success("Successfully upgraded to Premium RAG");
      return true;
    } catch (error) {
      logger.error("Error upgrading RAG tier:", error);
      toast.error("Failed to upgrade RAG tier");
      return false;
    }
  }
  
  /**
   * Track RAG usage for a project
   */
  static async trackRAGUsage(
    operation: 'query' | 'index', 
    projectId: string,
    metrics: {
      vectorsAdded?: number;
      tokensUsed?: number;
      latencyMs?: number;
    }
  ): Promise<void> {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session?.user) return;
      
      await supabase.functions.invoke('track-rag-usage', {
        body: {
          operation,
          userId: session.user.id,
          projectId,
          ...metrics
        }
      });
    } catch (error) {
      logger.error("Error tracking RAG usage:", error);
    }
  }
  
  /**
   * Check if a project exceeds standard tier limits and should be migrated
   */
  static async shouldMigrateToPreium(projectId: string): Promise<boolean> {
    try {
      const userMetrics = await this.getUserRAGMetrics();
      
      // If already premium, no need to migrate
      if (userMetrics.tier === 'premium') {
        return false;
      }
      
      // Get project vector stats
      const { data: stats, error } = await supabase
        .from('project_vectors')
        .select('id')
        .eq('project_id', projectId)
        .count();
        
      if (error) throw error;
      
      const vectorCount = stats || 0;
      const usagePercentage = (vectorCount / userMetrics.limits.maxVectors) * 100;
      
      // Recommend migration if usage is over 85%
      return usagePercentage > 85;
    } catch (error) {
      logger.error("Error checking migration status:", error);
      return false;
    }
  }
  
  /**
   * Migrate a project from standard to premium tier
   * This includes moving vectors from Supabase to Pinecone
   */
  static async migrateProjectToPremium(projectId: string): Promise<boolean> {
    try {
      // First upgrade the user to premium
      const upgradeSuccess = await this.upgradeToRagPremium();
      if (!upgradeSuccess) {
        throw new Error("Failed to upgrade to premium tier");
      }
      
      // Then migrate the vectors
      const { data, error } = await supabase.functions.invoke('migrate-project-vectors', {
        body: {
          projectId,
          targetStore: 'pinecone'
        }
      });
      
      if (error) throw error;
      
      toast.success("Project successfully migrated to premium tier");
      return true;
    } catch (error) {
      logger.error("Error migrating project to premium:", error);
      toast.error("Failed to migrate project to premium tier");
      return false;
    }
  }
}
