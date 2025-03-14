
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

/**
 * Service for handling project-related events and notifications
 */
export class ProjectEventService {
  /**
   * Notify the system when a project has been created, updated, or imported
   * 
   * @param userId - The ID of the user who owns the project
   * @param projectId - The ID of the project that was updated
   * @param eventType - The type of event (created, updated, imported)
   * @returns A promise that resolves when the notification is sent
   */
  static async notifyProjectChange(
    userId: string, 
    projectId: string, 
    eventType: 'project-created' | 'project-updated' | 'project-imported' = 'project-updated'
  ): Promise<void> {
    try {
      const { data, error } = await supabase.functions.invoke('project-events', {
        body: { 
          event: eventType, 
          payload: { userId, projectId } 
        }
      });

      if (error) throw error;
      
      console.log(`Project ${eventType.replace('project-', '')} notification sent successfully:`, data);
    } catch (error) {
      console.error(`Error notifying project ${eventType.replace('project-', '')}:`, error);
      toast.error(`Failed to update project status (${eventType.replace('project-', '')})`);
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
      await this.notifyProjectChange(userId, projectId, 'project-updated');
      
      toast.success("Project set as active");
    } catch (error) {
      console.error("Error setting active project:", error);
      toast.error("Failed to set project as active");
      throw error;
    }
  }
  
  /**
   * Notify the system when a new project has been created
   * 
   * @param userId - The ID of the user who created the project
   * @param projectId - The ID of the newly created project
   * @returns A promise that resolves when the notification is sent
   */
  static async notifyProjectCreated(userId: string, projectId: string): Promise<void> {
    return this.notifyProjectChange(userId, projectId, 'project-created');
  }
  
  /**
   * Notify the system when a project has been imported
   * 
   * @param userId - The ID of the user who imported the project
   * @param projectId - The ID of the imported project
   * @returns A promise that resolves when the notification is sent
   */
  static async notifyProjectImported(userId: string, projectId: string): Promise<void> {
    return this.notifyProjectChange(userId, projectId, 'project-imported');
  }
}
