
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useAuthStore } from "@/stores/auth";
import { ProjectService, ProjectCreateDTO, Project } from "@/services/projects/ProjectService";
import { toast } from "sonner";
import { useState } from "react";
import { useUIStore } from '@/stores/ui/store';

export function useProjects() {
  const { user } = useAuthStore();
  const { setActiveProject: setActiveProjectInUI } = useUIStore();
  const queryClient = useQueryClient();
  const [isCreating, setIsCreating] = useState(false);
  const [isActivating, setIsActivating] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  
  // Fetch all projects
  const { 
    data: projects, 
    isLoading: isLoadingProjects,
    error: projectsError,
    refetch: refetchProjects
  } = useQuery({
    queryKey: ['projects'],
    queryFn: () => ProjectService.getProjects(),
    enabled: !!user,
  });
  
  // Fetch active project
  const {
    data: activeProject,
    isLoading: isLoadingActiveProject,
    error: activeProjectError
  } = useQuery({
    queryKey: ['active-project'],
    queryFn: () => ProjectService.getActiveProject(),
    enabled: !!user,
  });

  // Create project mutation
  const createProject = useMutation({
    mutationFn: (projectData: ProjectCreateDTO) => {
      setIsCreating(true);
      return ProjectService.createProject(projectData);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['projects'] });
      queryClient.invalidateQueries({ queryKey: ['active-project'] });
    },
    onSettled: () => {
      setIsCreating(false);
    }
  });

  // Set active project mutation
  const setActiveProject = useMutation({
    mutationFn: (projectId: string) => {
      setIsActivating(true);
      return ProjectService.setActiveProject(projectId);
    },
    onSuccess: (_, projectId) => {
      setActiveProjectInUI(projectId);
      queryClient.invalidateQueries({ queryKey: ['projects'] });
      queryClient.invalidateQueries({ queryKey: ['active-project'] });
    },
    onSettled: () => {
      setIsActivating(false);
    }
  });

  // Delete project mutation
  const deleteProject = useMutation({
    mutationFn: (projectId: string) => {
      setIsDeleting(true);
      return ProjectService.deleteProject(projectId);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['projects'] });
      queryClient.invalidateQueries({ queryKey: ['active-project'] });
    },
    onSettled: () => {
      setIsDeleting(false);
    }
  });

  // Handle adding a new project
  const handleAddProject = async (projectData: ProjectCreateDTO) => {
    if (!user) {
      toast.error("You must be logged in to create a project");
      return null;
    }
    
    return createProject.mutateAsync(projectData);
  };

  // Handle activating a project
  const handleSetActiveProject = async (projectId: string) => {
    if (!user) {
      toast.error("You must be logged in to activate a project");
      return false;
    }
    
    return setActiveProject.mutateAsync(projectId);
  };

  // Handle deleting a project
  const handleDeleteProject = async (projectId: string) => {
    if (!user) {
      toast.error("You must be logged in to delete a project");
      return false;
    }
    
    return deleteProject.mutateAsync(projectId);
  };

  return {
    projects,
    activeProject,
    activeProjectId: activeProject?.id || null,
    isLoadingProjects,
    isLoadingActiveProject,
    isCreating,
    isActivating,
    isDeleting,
    projectsError,
    activeProjectError,
    createProject: handleAddProject,
    setActiveProject: handleSetActiveProject,
    deleteProject: handleDeleteProject,
    refetchProjects
  };
}
