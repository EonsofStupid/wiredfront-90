
import { logger } from "@/services/chat/LoggingService";
import { toast } from "sonner";
import { useProjects } from "@/hooks/projects/useProjects";
import { ProjectCreateDTO } from "@/services/projects/ProjectService";

/**
 * Hook for project-related actions
 */
export function useProjectActions() {
  const {
    createProject,
    setActiveProject,
    deleteProject,
    projects
  } = useProjects();
  
  const handleAddProject = async () => {
    try {
      logger.info("New project button clicked");
      
      const projectData: ProjectCreateDTO = {
        name: `New Project ${(projects?.length || 0) + 1}`,
        description: "Add a description"
      };
      
      await createProject(projectData);
    } catch (error) {
      console.error("Error adding project:", error);
      toast.error("Failed to create new project");
    }
  };

  const handleImportProject = (projectId: string) => {
    try {
      logger.info("Project import completed", { projectId });
      setActiveProject(projectId);
      return projectId;
    } catch (error) {
      console.error("Error handling import project:", error);
      toast.error("Failed to import project");
      return null;
    }
  };

  const handleDeleteProject = async (projectId: string) => {
    try {
      logger.info("Delete project button clicked", { projectId });
      await deleteProject(projectId);
    } catch (error) {
      console.error("Error deleting project:", error);
      toast.error("Failed to delete project");
    }
  };

  return {
    handleAddProject,
    handleImportProject,
    handleDeleteProject,
    setActiveProject
  };
}
