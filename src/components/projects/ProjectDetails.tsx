
import { Button } from "@/components/ui/button";
import { Code, ExternalLink, Folder, Info } from "lucide-react";
import { formatDistanceToNow } from "date-fns";

interface Project {
  id: string;
  name: string;
  description: string;
  lastModified: Date;
}

interface ProjectDetailsProps {
  project: Project | undefined;
  isGithubConnected: boolean;
  githubUsername: string | null;
}

export function ProjectDetails({
  project,
  isGithubConnected,
  githubUsername
}: ProjectDetailsProps) {
  if (!project) {
    return (
      <div className="flex flex-col items-center justify-center h-full p-4 space-y-6">
        <div className="text-center space-y-2">
          <h3 className="text-lg font-medium">No Project Selected</h3>
          <p className="text-sm text-muted-foreground">Create a new project or select one from the list below</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 space-y-4">
      <div>
        <h3 className="text-lg font-medium">{project.name}</h3>
        <p className="text-sm text-muted-foreground mt-1">
          Last updated {formatDistanceToNow(new Date(project.lastModified), { addSuffix: true })}
        </p>
      </div>
      
      <div className="space-y-1">
        <p className="text-sm font-medium">Description</p>
        <p className="text-sm text-muted-foreground">{project.description || "No description provided"}</p>
      </div>
      
      {isGithubConnected && githubUsername && (
        <div className="space-y-2">
          <p className="text-sm font-medium">GitHub Repository</p>
          <a 
            href={`https://github.com/${githubUsername}/${project.name}`} 
            target="_blank" 
            rel="noopener noreferrer"
            className="flex items-center gap-2 text-sm text-neon-blue hover:underline"
          >
            <ExternalLink className="h-4 w-4" />
            {`${githubUsername}/${project.name}`}
          </a>
        </div>
      )}
      
      <div className="pt-2 space-y-2">
        <Button
          variant="outline"
          size="sm"
          className="w-full justify-start gap-2"
        >
          <Code className="h-4 w-4" />
          View Code
        </Button>
        
        <Button
          variant="outline"
          size="sm"
          className="w-full justify-start gap-2"
        >
          <Info className="h-4 w-4" />
          Project Settings
        </Button>
      </div>
    </div>
  );
}
