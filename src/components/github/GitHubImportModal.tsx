
import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useGitHubProjects, GitHubRepo } from "@/hooks/github/useGitHubProjects";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Loader2, AlertCircle, Github } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";

interface GitHubImportModalProps {
  isOpen: boolean;
  onClose: () => void;
  onImportComplete: (projectId: string) => void;
}

export function GitHubImportModal({
  isOpen,
  onClose,
  onImportComplete
}: GitHubImportModalProps) {
  const { repos, isLoading, isImporting, fetchUserRepos, importProject } = useGitHubProjects();
  const [selectedRepo, setSelectedRepo] = useState<string>("");
  const [projectName, setProjectName] = useState<string>("");
  const [projectDescription, setProjectDescription] = useState<string>("");
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen) {
      fetchUserRepos().catch(console.error);
      setSelectedRepo("");
      setProjectName("");
      setProjectDescription("");
      setError(null);
    }
  }, [isOpen]);

  // Update project name when repo is selected
  useEffect(() => {
    if (selectedRepo) {
      const repo = repos.find(r => r.full_name === selectedRepo);
      if (repo) {
        setProjectName(repo.name);
      }
    }
  }, [selectedRepo, repos]);

  const handleImport = async () => {
    if (!selectedRepo) {
      setError("Please select a repository");
      return;
    }

    if (!projectName.trim()) {
      setError("Please enter a project name");
      return;
    }

    try {
      const project = await importProject(selectedRepo, projectName, projectDescription);
      if (project) {
        onImportComplete(project.id);
        onClose();
      }
    } catch (err) {
      console.error("Import error:", err);
      setError("Failed to import project. Please try again.");
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-[550px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Github className="h-5 w-5" />
            Import GitHub Repository
          </DialogTitle>
          <DialogDescription>
            Choose a GitHub repository to import as a new project
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          {error && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <div className="space-y-2">
            <label htmlFor="repo-select" className="text-sm font-medium">Repository</label>
            {isLoading ? (
              <div className="flex items-center gap-2 p-2">
                <Loader2 className="h-4 w-4 animate-spin" />
                <span>Loading repositories...</span>
              </div>
            ) : repos.length === 0 ? (
              <div className="text-sm text-muted-foreground p-2">
                No repositories found. Make sure you've connected your GitHub account.
              </div>
            ) : (
              <Select value={selectedRepo} onValueChange={setSelectedRepo}>
                <SelectTrigger id="repo-select">
                  <SelectValue placeholder="Select a repository" />
                </SelectTrigger>
                <SelectContent>
                  {repos.map((repo) => (
                    <SelectItem key={repo.id} value={repo.full_name}>
                      {repo.name} {repo.private ? "(Private)" : "(Public)"}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
          </div>

          <div className="space-y-2">
            <label htmlFor="project-name" className="text-sm font-medium">Project Name</label>
            <Input
              id="project-name"
              value={projectName}
              onChange={(e) => setProjectName(e.target.value)}
              placeholder="My Awesome Project"
            />
          </div>

          <div className="space-y-2">
            <label htmlFor="project-description" className="text-sm font-medium">Description (Optional)</label>
            <Textarea
              id="project-description"
              value={projectDescription}
              onChange={(e) => setProjectDescription(e.target.value)}
              placeholder="Describe your project to help AI understand it better"
              rows={3}
            />
          </div>

          <div className="text-sm text-muted-foreground mt-4">
            <p>
              After import, your project will be indexed for AI-assisted development. This helps WiredFront understand your codebase better.
            </p>
            <p className="mt-2">
              Note: You have a 1GB storage limit for project files and AI indexing.
            </p>
          </div>
        </div>

        <div className="flex justify-end gap-2">
          <Button variant="outline" onClick={onClose}>Cancel</Button>
          <Button 
            onClick={handleImport} 
            disabled={isImporting || isLoading}
          >
            {isImporting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Importing...
              </>
            ) : "Import Project"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
