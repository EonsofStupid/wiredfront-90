
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

/**
 * Service for handling project-related events and notifications
 */
export class ProjectEventService {
  /**
   * Notify the system when a project has been created or updated
   * 
   * @param userId - The ID of the user who owns the project
   * @param projectId - The ID of the project that was updated
   * @returns A promise that resolves when the notification is sent
   */
  static async notifyProjectChange(userId: string, projectId: string): Promise<void> {
    try {
      const { data, error } = await supabase.functions.invoke('project-events', {
        body: { 
          event: 'project-updated', 
          payload: { userId, projectId } 
        }
      });

      if (error) throw error;
      
      console.log("Project update notification sent successfully:", data);
    } catch (error) {
      console.error("Error notifying project change:", error);
      toast.error("Failed to update project status");
      throw error;
    }
  }

  /**
   * Set a project as active for a user
   * 
   * @param userId - The ID of the user
   * @param projectId - The ID of the project to set as active
   * @returns A promise that resolves when the project is set as active
   */
  static async setActiveProject(userId: string, projectId: string): Promise<void> {
    try {
      // First update the project directly
      const { error: updateError } = await supabase
        .from('projects')
        .update({ is_active: true, updated_at: new Date().toISOString() })
        .eq('id', projectId)
        .eq('user_id', userId);
      
      if (updateError) throw updateError;
      
      // Then notify the system about the change
      await this.notifyProjectChange(userId, projectId);
      
      toast.success("Project set as active");
    } catch (error) {
      console.error("Error setting active project:", error);
      toast.error("Failed to set project as active");
      throw error;
    }
  }
}
