
import { cn } from "@/lib/utils";
import { GitHubUserBadge } from "@/components/github/GitHubUserBadge";
import { Badge } from "@/components/ui/badge";
import { 
  CalendarIcon, 
  CodeIcon, 
  EditIcon, 
  FileIcon, 
  FolderIcon, 
  GithubIcon 
} from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { ScrollArea } from "@/components/ui/scroll-area";

interface Project {
  id: string;
  name: string;
  description?: string;
  lastModified: Date;
  github_repo?: string;
  language?: string;
  files_count?: number;
}

interface ProjectDetailsProps {
  project: Project;
  isGithubConnected?: boolean;
  githubUsername?: string | null;
  className?: string;
}

export function ProjectDetails({ 
  project, 
  isGithubConnected, 
  githubUsername,
  className 
}: ProjectDetailsProps) {
  const hasGitHubRepo = !!project.github_repo;
  
  return (
    <div className={cn("p-4", className)}>
      <div className="space-y-6">
        <div>
          <div className="flex justify-between items-start mb-2">
            <h3 className="text-xl font-medium text-neon-blue">
              {project.name}
            </h3>
            <button className="text-gray-400 hover:text-neon-blue">
              <EditIcon className="h-4 w-4" />
            </button>
          </div>
          
          <p className="text-sm text-gray-300">
            {project.description || "No description provided"}
          </p>
        </div>
        
        <div className="space-y-4">
          <div className="flex items-center gap-2 text-sm text-gray-400">
            <CalendarIcon className="h-4 w-4 text-neon-blue/70" />
            <span>Last modified {formatDistanceToNow(new Date(project.lastModified), { addSuffix: true })}</span>
          </div>
          
          {hasGitHubRepo && (
            <div className="flex items-center gap-2 text-sm text-gray-400">
              <GithubIcon className="h-4 w-4 text-neon-blue/70" />
              <span>{project.github_repo}</span>
              {isGithubConnected && githubUsername && (
                <GitHubUserBadge username={githubUsername} />
              )}
            </div>
          )}
          
          {project.language && (
            <div className="flex items-center gap-2 text-sm text-gray-400">
              <CodeIcon className="h-4 w-4 text-neon-blue/70" />
              <span>Primary language: {project.language}</span>
            </div>
          )}
          
          {project.files_count && (
            <div className="flex items-center gap-2 text-sm text-gray-400">
              <FileIcon className="h-4 w-4 text-neon-blue/70" />
              <span>{project.files_count} files</span>
            </div>
          )}
        </div>
        
        <div className="pt-4 border-t border-neon-blue/10">
          <h4 className="text-sm font-medium text-neon-blue/90 mb-2">Project Status</h4>
          <div className="flex items-center gap-2">
            <Badge variant="outline" className="bg-neon-blue/10 text-neon-blue border-neon-blue/30">
              Active
            </Badge>
            {hasGitHubRepo && (
              <Badge variant="outline" className="bg-neon-pink/10 text-neon-pink border-neon-pink/30">
                GitHub Synced
              </Badge>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
