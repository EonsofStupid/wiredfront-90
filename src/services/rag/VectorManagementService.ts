
import { supabase } from "@/integrations/supabase/client";
import { logger } from "@/services/chat/LoggingService";
import { toast } from "sonner";
import { VectorSearchService } from "./VectorSearchService";

export class VectorManagementService {
  /**
   * Delete vectors for a project
   */
  static async deleteProjectVectors(projectId: string): Promise<boolean> {
    try {
      const dbType = await VectorSearchService.getVectorDBType();
      
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
}
