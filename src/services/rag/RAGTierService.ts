
import { supabase } from "@/integrations/supabase/client";
import { logger } from "@/services/chat/LoggingService";
import { toast } from "sonner";

export class RAGTierService {
  /**
   * Check if the current user can use premium RAG features
   */
  static async canUsePremiumRAG(): Promise<boolean> {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session?.user) return false;
      
      const { data: userSettings, error } = await supabase
        .from('rag_user_settings')
        .select('tier')
        .eq('user_id', session.user.id)
        .single();
        
      if (error) throw error;
      
      return userSettings?.tier === 'premium';
    } catch (error) {
      logger.error("Error checking premium RAG status:", error);
      return false;
    }
  }
  
  /**
   * Upgrade the current user to premium RAG tier
   */
  static async upgradeToRagPremium(): Promise<boolean> {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session?.user) {
        toast.error("You must be logged in to upgrade");
        return false;
      }
      
      const { error } = await supabase
        .from('rag_user_settings')
        .update({
          tier: 'premium',
          max_vectors: 100000, // 100k vectors for premium
          max_queries: 1000,   // 1000 queries per month
          vectorstore_type: 'pinecone'
        })
        .eq('user_id', session.user.id);
        
      if (error) throw error;
      
      logger.info("User upgraded to premium RAG tier");
      return true;
    } catch (error) {
      logger.error("Error upgrading to premium RAG:", error);
      return false;
    }
  }
  
  /**
   * Check if a project should be migrated to premium tier
   * based on vector count and usage patterns
   */
  static async shouldMigrateToPreium(projectId: string): Promise<boolean> {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session?.user) return false;
      
      // Check if already on premium
      const isPremium = await this.canUsePremiumRAG();
      if (isPremium) return false;
      
      // Get current vector usage
      const { data: settings, error: settingsError } = await supabase
        .from('rag_user_settings')
        .select('vectors_used, max_vectors')
        .eq('user_id', session.user.id)
        .single();
        
      if (settingsError) throw settingsError;
      
      // If using more than 75% of vectors, suggest premium
      const usagePercentage = (settings.vectors_used / settings.max_vectors) * 100;
      return usagePercentage > 75;
    } catch (error) {
      logger.error("Error checking migration status:", error);
      return false;
    }
  }
}
