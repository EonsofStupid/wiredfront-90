
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { ProjectVector } from "@/types/admin/vector-database";

/**
 * Service for handling project vector operations
 */
export class VectorService {
  /**
   * Create vector embeddings for a project
   * 
   * @param projectId - The ID of the project 
   * @param vectorData - The data to be embedded
   * @returns A promise that resolves to the created vector ID
   */
  static async createVectorEmbedding(projectId: string, vectorData: any): Promise<string | null> {
    try {
      const { data, error } = await supabase.functions.invoke('vector-management', {
        body: { 
          action: 'create-vectors',
          projectId,
          vectorData
        }
      });

      if (error) throw error;
      
      console.log("Vector embedding created successfully:", data);
      return data.id;
    } catch (error) {
      console.error("Error creating vector embedding:", error);
      toast.error("Failed to create vector embedding");
      return null;
    }
  }

  /**
   * Delete a vector embedding
   * 
   * @param vectorId - The ID of the vector to delete
   * @returns A promise that resolves to true if successful
   */
  static async deleteVector(vectorId: string): Promise<boolean> {
    try {
      const { data, error } = await supabase.functions.invoke('vector-management', {
        body: { 
          action: 'delete-vector',
          vectorId
        }
      });

      if (error) throw error;
      
      console.log("Vector deleted successfully:", data);
      return true;
    } catch (error) {
      console.error("Error deleting vector:", error);
      toast.error("Failed to delete vector");
      return false;
    }
  }

  /**
   * Get all vector embeddings for a project
   * 
   * @param projectId - The ID of the project
   * @returns A promise that resolves to an array of project vectors
   */
  static async getProjectVectors(projectId: string): Promise<ProjectVector[]> {
    try {
      const { data, error } = await supabase.functions.invoke('vector-management', {
        body: { 
          action: 'get-project-vectors',
          projectId
        }
      });

      if (error) throw error;
      
      return data.vectors || [];
    } catch (error) {
      console.error("Error fetching project vectors:", error);
      toast.error("Failed to fetch project vectors");
      return [];
    }
  }
}
