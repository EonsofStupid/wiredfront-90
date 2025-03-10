
import { useUIStore } from "@/stores";
import { cn } from "@/lib/utils";
import { Plus, Folder } from "lucide-react";
import { Button } from "@/components/ui/button";
import { formatDistanceToNow } from "date-fns";

interface ProjectOverviewProps {
  className?: string;
  isCompact: boolean;
}

export const ProjectOverview = ({ className, isCompact }: ProjectOverviewProps) => {
  const { 
    project: { projects, activeProjectId },
    setActiveProject, 
    addProject 
  } = useUIStore();
  
  const handleAddProject = () => {
    addProject({
      name: `New Project ${projects.length + 1}`,
      description: "Add a description",
      lastModified: new Date(),
    });
  };
  
  return (
    <div className={cn("flex flex-col h-full", className)}>
      <div className="p-4 border-b border-neon-blue/20">
        <h2 className={cn(
          "text-neon-blue font-medium",
          isCompact ? "text-center" : "text-left"
        )}>
          {isCompact ? "Projects" : "My Projects"}
        </h2>
      </div>
      
      <div className="flex-1 overflow-auto p-3 space-y-2">
        {projects.map((project) => (
          <Button
            key={project.id}
            variant="ghost"
            className={cn(
              "w-full justify-start gap-2 h-auto py-3 px-3",
              "text-left hover:bg-dark-lighter/30",
              activeProjectId === project.id && "bg-dark-lighter/50 text-neon-blue"
            )}
            onClick={() => setActiveProject(project.id)}
          >
            <Folder className="w-5 h-5 shrink-0" />
            {!isCompact && (
              <div className="flex-1 overflow-hidden">
                <p className="truncate text-sm font-medium">{project.name}</p>
                <p className="truncate text-xs opacity-70">
                  {formatDistanceToNow(new Date(project.lastModified), { addSuffix: true })}
                </p>
              </div>
            )}
          </Button>
        ))}
      </div>
      
      <div className="p-3 border-t border-neon-blue/20">
        <Button
          variant="outline"
          size={isCompact ? "icon" : "default"}
          className="w-full"
          onClick={handleAddProject}
        >
          <Plus className="w-5 h-5" />
          {!isCompact && <span>New Project</span>}
        </Button>
      </div>
    </div>
  );
};
