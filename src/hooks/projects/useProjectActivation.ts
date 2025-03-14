
import { useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { ProjectEventService } from "@/services/projects/ProjectEventService";
import { RAGService } from "@/services/rag/RAGService";
import { toast } from "sonner";

export const useProjectActivation = () => {
  const [isActivating, setIsActivating] = useState(false);
  const [isCreating, setIsCreating] = useState(false);
  const [isIndexing, setIsIndexing] = useState(false);
  const queryClient = useQueryClient();

  const activateProject = async (userId: string, projectId: string) => {
    setIsActivating(true);
    try {
      await ProjectEventService.setActiveProject(userId, projectId);
      // Refresh project data
      queryClient.invalidateQueries({ queryKey: ['projects'] });
      queryClient.invalidateQueries({ queryKey: ['active-project'] });
      toast.success("Project activated successfully");
    } catch (error) {
      console.error("Error activating project:", error);
      toast.error("Failed to activate project");
    } finally {
      setIsActivating(false);
    }
  };

  const createProject = async (userId: string, projectData: {
    name: string;
    description?: string;
    github_repo?: string;
  }) => {
    setIsCreating(true);
    try {
      // Create project in Supabase
      const { data, error } = await ProjectEventService.createProject(userId, projectData);
      
      if (error) throw error;
      
      // Notify the system about the new project
      await notifyProjectCreated(userId, data.id);
      
      // Start indexing the project in the background
      setIsIndexing(true);
      await RAGService.indexProject(data.id);
      
      // Refresh project data
      queryClient.invalidateQueries({ queryKey: ['projects'] });
      queryClient.invalidateQueries({ queryKey: ['active-project'] });
      
      toast.success("Project created successfully");
      return data;
    } catch (error) {
      console.error("Error creating project:", error);
      toast.error("Failed to create project");
      throw error;
    } finally {
      setIsCreating(false);
      setIsIndexing(false);
    }
  };

  const notifyProjectCreated = async (userId: string, projectId: string) => {
    try {
      await ProjectEventService.notifyProjectCreated(userId, projectId);
      // Refresh project data
      queryClient.invalidateQueries({ queryKey: ['projects'] });
      queryClient.invalidateQueries({ queryKey: ['active-project'] });
      toast.success("Project created successfully");
    } catch (error) {
      console.error("Error notifying project creation:", error);
      toast.error("Failed to register new project");
    }
  };

  const notifyProjectImported = async (userId: string, projectId: string) => {
    try {
      await ProjectEventService.notifyProjectImported(userId, projectId);
      // Refresh project data
      queryClient.invalidateQueries({ queryKey: ['projects'] });
      queryClient.invalidateQueries({ queryKey: ['active-project'] });
      toast.success("Project imported successfully");
      
      // Start indexing the imported project
      setIsIndexing(true);
      await RAGService.indexProject(projectId);
    } catch (error) {
      console.error("Error notifying project import:", error);
      toast.error("Failed to register imported project");
    } finally {
      setIsIndexing(false);
    }
  };

  return {
    activateProject,
    createProject,
    notifyProjectCreated,
    notifyProjectImported,
    isActivating,
    isCreating,
    isIndexing
  };
};
