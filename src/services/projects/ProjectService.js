import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { logger } from "@/services/chat/LoggingService";
/**
 * Service for managing projects with Supabase
 */
export class ProjectService {
    /**
     * Get all projects for the current user
     */
    static async getProjects() {
        try {
            const { data, error } = await supabase
                .from('projects')
                .select('*')
                .order('updated_at', { ascending: false });
            if (error)
                throw error;
            return data || [];
        }
        catch (error) {
            console.error("Error fetching projects:", error);
            toast.error("Failed to load projects");
            return [];
        }
    }
    /**
     * Get the active project for the current user
     */
    static async getActiveProject() {
        try {
            const { data, error } = await supabase
                .from('projects')
                .select('*')
                .eq('is_active', true)
                .maybeSingle();
            if (error)
                throw error;
            return data;
        }
        catch (error) {
            console.error("Error fetching active project:", error);
            toast.error("Failed to load active project");
            return null;
        }
    }
    /**
     * Create a new project
     */
    static async createProject(projectData) {
        try {
            const { data, error } = await supabase
                .from('projects')
                .insert({
                name: projectData.name,
                description: projectData.description || null,
                github_repo: projectData.github_repo || null,
                status: 'active'
            })
                .select()
                .single();
            if (error)
                throw error;
            toast.success("Project created successfully");
            return data;
        }
        catch (error) {
            console.error("Error creating project:", error);
            toast.error("Failed to create project");
            return null;
        }
    }
    /**
     * Set a project as active
     */
    static async setActiveProject(projectId) {
        try {
            // First update all projects to inactive (the RLS policy and database trigger will handle this)
            const { error } = await supabase
                .from('projects')
                .update({
                is_active: true,
                updated_at: new Date().toISOString()
            })
                .eq('id', projectId);
            if (error)
                throw error;
            toast.success("Project activated");
            return true;
        }
        catch (error) {
            console.error("Error setting active project:", error);
            toast.error("Failed to set project as active");
            return false;
        }
    }
    /**
     * Delete a project
     */
    static async deleteProject(projectId) {
        try {
            // First check if this is the active project
            const { data: project } = await supabase
                .from('projects')
                .select('is_active')
                .eq('id', projectId)
                .single();
            // Then delete the project
            const { error } = await supabase
                .from('projects')
                .delete()
                .eq('id', projectId);
            if (error)
                throw error;
            logger.info("Project deleted", { projectId });
            toast.success("Project deleted successfully");
            return true;
        }
        catch (error) {
            console.error("Error deleting project:", error);
            toast.error("Failed to delete project");
            return false;
        }
    }
}
