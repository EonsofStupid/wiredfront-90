
import { useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { ProjectEventService } from "@/services/projects/ProjectEventService";
import { toast } from "sonner";

export const useProjectActivation = () => {
  const [isActivating, setIsActivating] = useState(false);
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
    } catch (error) {
      console.error("Error notifying project import:", error);
      toast.error("Failed to register imported project");
    }
  };

  return {
    activateProject,
    notifyProjectCreated,
    notifyProjectImported,
    isActivating
  };
};
