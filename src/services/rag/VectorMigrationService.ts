
import { supabase } from "@/integrations/supabase/client";
import { logger } from "@/services/chat/LoggingService";
import { toast } from "sonner";
import { RAGService } from "./RAGService";

export class VectorMigrationService {
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
