
import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { ErrorMessage } from "@/components/ui/error-message";
import { ProjectIndexingStatus } from "@/components/projects/ProjectIndexingStatus";
import { supabase } from "@/integrations/supabase/client";
import { useGitHubConnection } from "@/hooks/useGitHubConnection";
import { toast } from "sonner";

interface GitHubImportModalProps {
  isOpen: boolean;
  onClose: () => void;
  onImportComplete: (projectId: string) => void;
}

export function GitHubImportModal({ isOpen, onClose, onImportComplete }: GitHubImportModalProps) {
  const [repositories, setRepositories] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedRepo, setSelectedRepo] = useState<string | null>(null);
  const [importedProjectId, setImportedProjectId] = useState<string | null>(null);
  const { isConnected } = useGitHubConnection();

  useEffect(() => {
    if (isOpen && isConnected) {
      fetchRepositories();
    }
  }, [isOpen, isConnected]);

  const fetchRepositories = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) {
        throw new Error("You must be logged in to import repositories");
      }

      const response = await fetch(`${import.meta.env.VITE_SUPABASE_URL}/functions/v1/github-repo-management`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${session.access_token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          action: 'fetch-repos'
        })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to fetch repositories');
      }

      const data = await response.json();
      setRepositories(data.repos);
    } catch (error) {
      console.error("Error fetching repositories:", error);
      setError(error instanceof Error ? error.message : "Failed to fetch GitHub repositories");
    } finally {
      setIsLoading(false);
    }
  };

  const handleImportRepo = async (repoFullName: string) => {
    setIsLoading(true);
    setError(null);

    try {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) {
        throw new Error("You must be logged in to import a repository");
      }

      // Create a project in the database
      const repoName = repoFullName.split('/')[1]; // Get repo name from full name (owner/name)
      const { data: project, error: projectError } = await supabase
        .from('projects')
        .insert({
          name: repoName,
          description: `Imported from GitHub: ${repoFullName}`,
          github_repo: repoFullName,
          is_active: true
        })
        .select()
        .single();

      if (projectError || !project) {
        throw new Error(projectError?.message || "Failed to create project");
      }

      // Start indexing the repository for RAG
      const indexResponse = await fetch(`${import.meta.env.VITE_SUPABASE_URL}/functions/v1/github-repo-management`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${session.access_token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          action: 'index-repo',
          repoFullName,
          projectId: project.id
        })
      });

      if (!indexResponse.ok) {
        const errorData = await indexResponse.json();
        throw new Error(errorData.error || 'Failed to index repository');
      }

      setSelectedRepo(repoFullName);
      setImportedProjectId(project.id);
      toast.success("Repository imported successfully!");
    } catch (error) {
      console.error("Error importing repository:", error);
      setError(error instanceof Error ? error.message : "Failed to import repository");
    } finally {
      setIsLoading(false);
    }
  };

  const handleComplete = () => {
    if (importedProjectId) {
      onImportComplete(importedProjectId);
    }
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Import GitHub Repository</DialogTitle>
        </DialogHeader>

        {error && (
          <ErrorMessage message={error} />
        )}

        {importedProjectId && selectedRepo ? (
          <div className="space-y-4">
            <ProjectIndexingStatus projectId={importedProjectId} repoName={selectedRepo} />
            <div className="flex justify-end">
              <Button onClick={handleComplete}>Done</Button>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            {isLoading ? (
              <div className="py-4 text-center">Loading repositories...</div>
            ) : repositories.length > 0 ? (
              <div className="max-h-[400px] overflow-y-auto space-y-2">
                {repositories.map((repo) => (
                  <div 
                    key={repo.id}
                    className="p-3 border rounded-md hover:bg-accent cursor-pointer flex justify-between items-center"
                    onClick={() => handleImportRepo(repo.full_name)}
                  >
                    <div>
                      <div className="font-medium">{repo.name}</div>
                      <div className="text-sm text-muted-foreground">{repo.full_name}</div>
                    </div>
                    <Button variant="outline" size="sm">Import</Button>
                  </div>
                ))}
              </div>
            ) : (
              <div className="py-4 text-center">
                No repositories found. Please make sure your GitHub account has repositories.
              </div>
            )}
            
            <div className="flex justify-end">
              <Button variant="outline" onClick={onClose}>Cancel</Button>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
