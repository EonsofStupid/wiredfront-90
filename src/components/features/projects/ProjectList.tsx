
import { Button } from "@/components/ui/button";
import { Folder, Github, Plus, Trash2 } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { cn } from "@/lib/utils";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Project } from "@/services/projects/ProjectService";
import { useState } from "react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

interface ProjectListProps {
  projects: Project[];
  activeProjectId: string | null;
  onSelectProject: (id: string) => void;
  onAddProject: () => void;
  onImportProject: () => void;
  onDeleteProject: (id: string) => void;
  isGithubConnected: boolean;
  isLoading?: boolean;
}

export function ProjectList({
  projects,
  activeProjectId,
  onSelectProject,
  onAddProject,
  onImportProject,
  onDeleteProject,
  isGithubConnected,
  isLoading = false
}: ProjectListProps) {
  const [projectToDelete, setProjectToDelete] = useState<string | null>(null);
  
  const handleDeleteProject = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setProjectToDelete(id);
  };

  const confirmDelete = () => {
    if (projectToDelete) {
      onDeleteProject(projectToDelete);
      setProjectToDelete(null);
    }
  };

  return (
    <>
      <div className="p-4 border-t border-neon-blue/20 bg-gradient-to-b from-dark-lighter/20 to-dark-lighter/5">
        <h3 className="text-sm font-medium text-neon-blue/90 mb-3">My Projects</h3>
        
        <ScrollArea className="max-h-[180px] pr-3 -mr-3">
          <div className="space-y-2">
            {isLoading ? (
              <div className="py-4 text-center">
                <p className="text-sm text-gray-400">Loading projects...</p>
              </div>
            ) : projects.length > 0 ? (
              projects.map((project) => (
                <Button
                  key={project.id}
                  variant="ghost"
                  className={cn(
                    "w-full justify-start gap-2 h-auto py-2 px-3",
                    "text-left hover:bg-dark-lighter/30 group",
                    "border border-transparent transition-all duration-200",
                    activeProjectId === project.id && "bg-dark-lighter/50 text-neon-blue border-neon-blue/20"
                  )}
                  onClick={() => onSelectProject(project.id)}
                >
                  <Folder className={cn(
                    "w-4 h-4 shrink-0",
                    activeProjectId === project.id ? "text-neon-blue" : "text-gray-400 group-hover:text-neon-blue/70"
                  )} />
                  <div className="flex-1 overflow-hidden">
                    <p className="truncate text-sm font-medium">{project.name}</p>
                    <p className="truncate text-xs opacity-70">
                      {formatDistanceToNow(new Date(project.updated_at), { addSuffix: true })}
                    </p>
                  </div>
                  <button 
                    onClick={(e) => handleDeleteProject(project.id, e)}
                    className="opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <Trash2 className="w-4 h-4 text-gray-400 hover:text-red-500" />
                  </button>
                </Button>
              ))
            ) : (
              <div className="text-center py-3">
                <p className="text-sm text-gray-400">No projects yet</p>
              </div>
            )}
          </div>
        </ScrollArea>
        
        <div className="mt-4 space-y-2">
          <Button
            variant="outline"
            size="sm"
            className="w-full justify-start border-neon-blue/30 text-neon-blue hover:bg-neon-blue/10 hover:border-neon-blue/50"
            onClick={onAddProject}
          >
            <Plus className="w-4 h-4 mr-2" />
            New Project
          </Button>
          
          <Button
            variant="outline"
            size="sm"
            className={cn(
              "w-full justify-start",
              isGithubConnected 
                ? "border-neon-pink/30 text-neon-pink hover:bg-neon-pink/10 hover:border-neon-pink/50" 
                : "border-gray-700 text-gray-400 opacity-70 hover:bg-gray-800/50"
            )}
            onClick={onImportProject}
            disabled={!isGithubConnected}
          >
            <Github className="w-4 h-4 mr-2" />
            Import from GitHub
          </Button>
        </div>
      </div>

      <AlertDialog open={!!projectToDelete} onOpenChange={(open) => !open && setProjectToDelete(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Project</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this project? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDelete} className="bg-red-500 hover:bg-red-600">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
