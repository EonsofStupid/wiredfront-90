
import { Button } from "@/components/ui/button";
import { Folder, Plus } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { cn } from "@/lib/utils";

interface Project {
  id: string;
  name: string;
  description?: string; // Made optional to match the store type
  lastModified: Date;
}

interface ProjectListProps {
  projects: Project[];
  activeProjectId: string | null;
  onSelectProject: (id: string) => void;
  onAddProject: () => void;
}

export function ProjectList({
  projects,
  activeProjectId,
  onSelectProject,
  onAddProject
}: ProjectListProps) {
  return (
    <div className="p-4 border-t border-neon-blue/20 space-y-3">
      <h3 className="text-sm font-medium">My Projects</h3>
      
      <div className="space-y-2 max-h-40 overflow-y-auto">
        {projects.map((project) => (
          <Button
            key={project.id}
            variant="ghost"
            className={cn(
              "w-full justify-start gap-2 h-auto py-2 px-3",
              "text-left hover:bg-dark-lighter/30",
              activeProjectId === project.id && "bg-dark-lighter/50 text-neon-blue"
            )}
            onClick={() => onSelectProject(project.id)}
          >
            <Folder className="w-4 h-4 shrink-0" />
            <div className="flex-1 overflow-hidden">
              <p className="truncate text-sm font-medium">{project.name}</p>
              <p className="truncate text-xs opacity-70">
                {formatDistanceToNow(new Date(project.lastModified), { addSuffix: true })}
              </p>
            </div>
          </Button>
        ))}
      </div>
      
      <Button
        variant="outline"
        size="sm"
        className="w-full"
        onClick={onAddProject}
      >
        <Plus className="w-4 h-4 mr-2" />
        New Project
      </Button>
    </div>
  );
}
