
import { useUIStore } from "@/stores";
import { cn } from "@/lib/utils";
import { Plus, Folder, Edit, ExternalLink, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { formatDistanceToNow } from "date-fns";
import { GithubStatus } from "./GithubStatus";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useState } from "react";
import { toast } from "sonner";

interface ProjectOverviewProps {
  className?: string;
  isCompact: boolean;
}

export const ProjectOverview = ({ className, isCompact }: ProjectOverviewProps) => {
  const { 
    project: { projects, activeProjectId },
    github: { isConnected },
    setActiveProject, 
    addProject,
    updateProject,
    removeProject
  } = useUIStore();
  
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [editProjectName, setEditProjectName] = useState("");
  const [editProjectDesc, setEditProjectDesc] = useState("");
  const [editProjectRepoUrl, setEditProjectRepoUrl] = useState("");
  const [editingProjectId, setEditingProjectId] = useState<string | null>(null);
  
  const activeProject = projects.find(p => p.id === activeProjectId);
  
  const handleAddProject = () => {
    addProject({
      name: `New Project ${projects.length + 1}`,
      description: "Add a description",
      lastModified: new Date(),
    });
  };

  const openEditDialog = (project: typeof projects[0]) => {
    setEditingProjectId(project.id);
    setEditProjectName(project.name);
    setEditProjectDesc(project.description || "");
    setEditProjectRepoUrl(project.githubRepoUrl || "");
    setShowEditDialog(true);
  };
  
  const handleSaveProject = () => {
    if (!editingProjectId) return;
    
    updateProject(editingProjectId, {
      name: editProjectName,
      description: editProjectDesc,
      githubRepoUrl: editProjectRepoUrl,
      lastModified: new Date()
    });
    
    setShowEditDialog(false);
    toast.success("Project updated");
  };
  
  const handleDeleteProject = (projectId: string) => {
    if (projects.length <= 1) {
      toast.error("Cannot delete the last project");
      return;
    }
    
    removeProject(projectId);
    toast.success("Project deleted");
  };
  
  return (
    <div className={cn("flex flex-col h-full glass-card border-neon-blue/20 border-l", className)}>
      <div className="p-4 border-b border-neon-blue/20">
        <h2 className={cn(
          "text-neon-blue font-medium",
          isCompact ? "text-center" : "text-left"
        )}>
          {isCompact ? "Projects" : "My Projects"}
        </h2>
      </div>
      
      <GithubStatus isCompact={isCompact} />
      
      {activeProject && !isCompact && (
        <div className="p-4 border-b border-neon-blue/20">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-medium">Active Project</h3>
            <Button 
              variant="ghost" 
              size="icon" 
              className="h-6 w-6"
              onClick={() => openEditDialog(activeProject)}
            >
              <Edit className="h-3.5 w-3.5" />
            </Button>
          </div>
          <p className="text-xs mt-1 line-clamp-2">{activeProject.name}</p>
          
          {activeProject.description && (
            <p className="text-xs text-muted-foreground mt-1 line-clamp-2">
              {activeProject.description}
            </p>
          )}
          
          {isConnected && activeProject.githubRepoUrl && (
            <a 
              href={activeProject.githubRepoUrl} 
              target="_blank" 
              rel="noopener noreferrer"
              className="flex items-center gap-1 text-xs text-neon-blue mt-2 hover:underline"
            >
              <ExternalLink className="h-3 w-3" />
              Repository
            </a>
          )}
        </div>
      )}
      
      <div className="flex-1 overflow-auto p-3 space-y-2">
        {projects.map((project) => (
          <div 
            key={project.id} 
            className={cn(
              "relative group",
              activeProjectId === project.id && "text-neon-blue"
            )}
          >
            <Button
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
            
            {!isCompact && (
              <div className={cn(
                "absolute right-2 top-1/2 -translate-y-1/2 flex gap-1",
                "opacity-0 group-hover:opacity-100 transition-opacity"
              )}>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-6 w-6"
                  onClick={() => openEditDialog(project)}
                >
                  <Edit className="h-3.5 w-3.5" />
                </Button>
                
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-6 w-6 text-destructive"
                  onClick={() => handleDeleteProject(project.id)}
                >
                  <Trash2 className="h-3.5 w-3.5" />
                </Button>
              </div>
            )}
          </div>
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
      
      <Dialog open={showEditDialog} onOpenChange={setShowEditDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Edit Project</DialogTitle>
          </DialogHeader>
          
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <label htmlFor="project-name" className="text-sm font-medium">
                Project Name
              </label>
              <input
                id="project-name"
                type="text"
                value={editProjectName}
                onChange={(e) => setEditProjectName(e.target.value)}
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
              />
            </div>
            
            <div className="grid gap-2">
              <label htmlFor="project-desc" className="text-sm font-medium">
                Description
              </label>
              <textarea
                id="project-desc"
                value={editProjectDesc}
                onChange={(e) => setEditProjectDesc(e.target.value)}
                className="flex min-h-20 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
              />
            </div>
            
            <div className="grid gap-2">
              <label htmlFor="repo-url" className="text-sm font-medium flex items-center gap-2">
                GitHub Repository URL
                {!isConnected && (
                  <span className="text-xs text-muted-foreground">
                    (Connect GitHub first)
                  </span>
                )}
              </label>
              <input
                id="repo-url"
                type="text"
                value={editProjectRepoUrl}
                onChange={(e) => setEditProjectRepoUrl(e.target.value)}
                disabled={!isConnected}
                placeholder={isConnected ? "https://github.com/username/repo" : "Connect GitHub to add repository"}
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
              />
            </div>
          </div>
          
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => setShowEditDialog(false)}>
              Cancel
            </Button>
            <Button type="button" onClick={handleSaveProject}>
              Save Changes
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};
