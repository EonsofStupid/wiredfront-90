
import { useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { ProjectEventService } from "@/services/projects/ProjectEventService";

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
    } catch (error) {
      console.error("Error activating project:", error);
    } finally {
      setIsActivating(false);
    }
  };

  return {
    activateProject,
    isActivating
  };
};
