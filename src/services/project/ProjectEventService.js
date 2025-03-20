import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
/**
 * Service for handling project-related events and notifications
 */
export class ProjectEventService {
    /**
     * Create a new project
     *
     * @param userId - The ID of the user who owns the project
     * @param projectData - The project data (name, description, etc.)
     * @returns A promise that resolves to the created project
     */
    static async createProject(userId, projectData) {
        try {
            const { data, error } = await supabase
                .from('projects')
                .insert({
                user_id: userId,
                name: projectData.name,
                description: projectData.description || null,
                github_repo: projectData.github_repo || null,
                status: 'active'
            })
                .select()
                .single();
            if (error)
                throw error;
            return { data, error: null };
        }
        catch (error) {
            console.error("Error creating project:", error);
            return { data: null, error };
        }
    }
    /**
     * Log project creation event
     *
     * @param projectId - The ID of the project that was created
     * @param eventData - Additional data about the creation event
     * @returns A promise that resolves when the event is logged
     */
    static async logProjectCreation(projectId, eventData) {
        try {
            await supabase
                .from('user_analytics')
                .insert({
                event_type: 'project_creation',
                metadata: {
                    project_id: projectId,
                    project_name: eventData.projectName,
                    has_github_repo: eventData.hasGithubRepo,
                    is_imported: eventData.isImported
                }
            });
            console.log("Project creation event logged successfully");
        }
        catch (error) {
            console.error("Error logging project creation:", error);
            // We don't show an error toast here as this is just analytics logging
        }
    }
    /**
     * Notify the system when a project has been created, updated, or imported
     *
     * @param userId - The ID of the user who owns the project
     * @param projectId - The ID of the project that was updated
     * @param eventType - The type of event (created, updated, imported)
     * @returns A promise that resolves when the notification is sent
     */
    static async notifyProjectChange(userId, projectId, eventType = 'project-updated') {
        try {
            const { data, error } = await supabase.functions.invoke('project-events', {
                body: {
                    event: eventType,
                    payload: { userId, projectId }
                }
            });
            if (error)
                throw error;
            console.log(`Project ${eventType.replace('project-', '')} notification sent successfully:`, data);
        }
        catch (error) {
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
    static async setActiveProject(userId, projectId) {
        try {
            // First update the project directly
            const { error: updateError } = await supabase
                .from('projects')
                .update({ is_active: true, updated_at: new Date().toISOString() })
                .eq('id', projectId)
                .eq('user_id', userId);
            if (updateError)
                throw updateError;
            // Then notify the system about the change
            await this.notifyProjectChange(userId, projectId, 'project-updated');
            toast.success("Project set as active");
        }
        catch (error) {
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
    static async notifyProjectCreated(userId, projectId) {
        return this.notifyProjectChange(userId, projectId, 'project-created');
    }
    /**
     * Notify the system when a project has been imported
     *
     * @param userId - The ID of the user who imported the project
     * @param projectId - The ID of the imported project
     * @returns A promise that resolves when the notification is sent
     */
    static async notifyProjectImported(userId, projectId) {
        return this.notifyProjectChange(userId, projectId, 'project-imported');
    }
}
