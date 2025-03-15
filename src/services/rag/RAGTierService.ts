
import { supabase } from "@/integrations/supabase/client";
import { logger } from "@/services/chat/LoggingService";
import { toast } from "sonner";
import { RAGTier } from "./types";
import { RAGMetricsService } from "./RAGMetricsService";

export class RAGTierService {
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
   * Check if a project exceeds standard tier limits and should be migrated
   */
  static async shouldMigrateToPreium(projectId: string): Promise<boolean> {
    try {
      const { tier, limits } = await RAGMetricsService.getUserRAGMetrics();
      
      // If already premium, no need to migrate
      if (tier === 'premium') {
        return false;
      }
      
      // Get project vector stats
      const { data, error, count } = await supabase
        .from('project_vectors')
        .select('id', { count: 'exact', head: true })
        .eq('project_id', projectId);
        
      if (error) throw error;
      
      const vectorCount = count || 0;
      const usagePercentage = (vectorCount / limits.maxVectors) * 100;
      
      // Recommend migration if usage is over 85%
      return usagePercentage > 85;
    } catch (error) {
      logger.error("Error checking migration status:", error);
      return false;
    }
  }
}
