
import React from "react";
import { cn } from "@/lib/utils";
import { useUIStore } from "@/stores";
import { GithubStatus } from "./GithubStatus";
import { ExternalLink } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { Button } from "@/components/ui/button";

interface ProjectOverviewProps {
  className?: string;
  isCompact: boolean;
}

export const ProjectOverview = ({
  className,
  isCompact
}: ProjectOverviewProps) => {
  const { project, github } = useUIStore();
  const activeProject = project.projects.find(p => p.id === project.activeProjectId) || project.projects[0];

  return (
    <div className={cn("h-full flex flex-col bg-muted/30 border-l border-neon-blue/20", className)}>
      {isCompact ? (
        <div className="p-4 flex flex-col items-center space-y-4">
          <div className="w-10 h-10 rounded-full bg-neon-blue/20 flex items-center justify-center">
            <span className="text-xs font-bold">{activeProject?.name.substring(0, 2).toUpperCase()}</span>
          </div>
          <GithubStatus isCompact={isCompact} className="w-full" />
        </div>
      ) : (
        <div className="flex flex-col h-full">
          <div className="p-4 border-b border-neon-blue/20">
            <h2 className="text-sm font-semibold mb-2">Project</h2>
            <div className="space-y-2">
              <div className="text-xs font-medium">{activeProject?.name}</div>
              {activeProject?.description && (
                <p className="text-xs text-muted-foreground">{activeProject.description}</p>
              )}
              <div className="text-xs text-muted-foreground">
                Updated {formatDistanceToNow(activeProject?.lastModified || new Date(), { addSuffix: true })}
              </div>
              {activeProject?.githubRepoUrl && (
                <a 
                  href={activeProject.githubRepoUrl} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-xs text-blue-500 hover:text-blue-700 flex items-center mt-2"
                >
                  <ExternalLink className="h-3 w-3 mr-1" />
                  View on GitHub
                </a>
              )}
            </div>
          </div>
          
          <GithubStatus isCompact={isCompact} className="w-full" />
          
          <div className="mt-auto p-4 border-t border-neon-blue/20">
            <Button 
              variant="outline" 
              size="sm" 
              className="w-full text-xs"
              disabled={!github.isConnected}
            >
              Sync with GitHub
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};
