
import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { ErrorMessage } from "@/components/ui/error-message";
import { ProjectIndexingStatus } from "@/components/projects/ProjectIndexingStatus";
import { supabase } from "@/integrations/supabase/client";
import { useGitHubConnection } from "@/hooks/useGitHubConnection";
import { toast } from "sonner";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  ArrowLeft, 
  ArrowRight, 
  Check, 
  Github, 
  Loader2, 
  Search, 
  Star 
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";

interface GitHubImportModalProps {
  isOpen: boolean;
  onClose: () => void;
  onImportComplete: (projectId: string) => void;
}

type GitHubRepo = {
  id: number;
  name: string;
  full_name: string;
  description: string | null;
  html_url: string;
  private: boolean;
  stargazers_count: number;
  language: string | null;
  updated_at: string;
  default_branch: string;
}

type ImportStep = 'select-repo' | 'configure-project' | 'indexing';

export function GitHubImportModal({ isOpen, onClose, onImportComplete }: GitHubImportModalProps) {
  const [repositories, setRepositories] = useState<GitHubRepo[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedRepo, setSelectedRepo] = useState<GitHubRepo | null>(null);
  const [importedProjectId, setImportedProjectId] = useState<string | null>(null);
  const [currentStep, setCurrentStep] = useState<ImportStep>('select-repo');
  const [searchQuery, setSearchQuery] = useState('');
  const [projectDetails, setProjectDetails] = useState({
    name: '',
    description: '',
    techStack: [] as string[]
  });
  
  const { isConnected } = useGitHubConnection();

  useEffect(() => {
    if (isOpen && isConnected) {
      fetchRepositories();
    }
    
    // Reset state when modal opens
    if (isOpen) {
      setCurrentStep('select-repo');
      setSelectedRepo(null);
      setImportedProjectId(null);
      setError(null);
      setProjectDetails({
        name: '',
        description: '',
        techStack: []
      });
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

      // Get the raw response text
      const responseText = await response.text();
      
      if (!response.ok) {
        console.error("GitHub API error response:", responseText);
        throw new Error('Failed to fetch repositories');
      }

      // Try to parse the response as JSON
      let data;
      try {
        data = JSON.parse(responseText);
      } catch (parseError) {
        console.error("JSON parsing error:", parseError, "Raw response:", responseText);
        throw new Error('Invalid response format from server');
      }

      if (data.error) {
        throw new Error(data.error);
      }

      setRepositories(data.repos || []);
    } catch (error) {
      console.error("Error fetching repositories:", error);
      setError(error instanceof Error ? error.message : "Failed to fetch GitHub repositories");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSelectRepo = (repo: GitHubRepo) => {
    setSelectedRepo(repo);
    setProjectDetails({
      name: repo.name,
      description: repo.description || '',
      techStack: repo.language ? [repo.language] : []
    });
    setCurrentStep('configure-project');
  };

  const handleImportRepo = async () => {
    if (!selectedRepo) return;
    
    setIsLoading(true);
    setError(null);

    try {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) {
        throw new Error("You must be logged in to import a repository");
      }

      // Create a project in the database
      const techStackObj = {
        primaryLanguage: selectedRepo.language || "unknown",
        languages: projectDetails.techStack
      };
      
      const { data: project, error: projectError } = await supabase
        .from('projects')
        .insert({
          name: projectDetails.name,
          description: projectDetails.description,
          github_repo: selectedRepo.full_name,
          tech_stack: techStackObj,
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
          repoFullName: selectedRepo.full_name,
          projectId: project.id
        })
      });

      if (!indexResponse.ok) {
        const errorText = await indexResponse.text();
        console.error("Indexing error response:", errorText);
        
        let errorData;
        try {
          errorData = JSON.parse(errorText);
        } catch (e) {
          throw new Error('Failed to index repository: ' + errorText);
        }
        
        throw new Error(errorData.error || 'Failed to index repository');
      }

      setImportedProjectId(project.id);
      setCurrentStep('indexing');
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
  
  const filteredRepos = searchQuery 
    ? repositories.filter(repo => 
        repo.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
        repo.full_name.toLowerCase().includes(searchQuery.toLowerCase()))
    : repositories;

  const renderStepContent = () => {
    switch (currentStep) {
      case 'select-repo':
        return (
          <div className="space-y-4">
            <div className="relative">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search repositories..."
                className="pl-9"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            
            {isLoading ? (
              <div className="py-8 flex flex-col items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin text-primary mb-4" />
                <p className="text-muted-foreground">Loading repositories...</p>
              </div>
            ) : filteredRepos.length > 0 ? (
              <div className="max-h-[400px] overflow-y-auto space-y-2">
                {filteredRepos.map((repo) => (
                  <div 
                    key={repo.id}
                    className="p-3 border rounded-md hover:bg-accent cursor-pointer"
                    onClick={() => handleSelectRepo(repo)}
                  >
                    <div className="flex justify-between items-start">
                      <div>
                        <div className="font-medium">{repo.name}</div>
                        <div className="text-sm text-muted-foreground">{repo.full_name}</div>
                        {repo.description && (
                          <div className="text-sm mt-1 line-clamp-2">{repo.description}</div>
                        )}
                      </div>
                      <div className="flex items-center space-x-1 text-sm text-muted-foreground">
                        <Star className="h-3.5 w-3.5" />
                        <span>{repo.stargazers_count}</span>
                      </div>
                    </div>
                    <div className="mt-2 flex items-center gap-2">
                      {repo.language && (
                        <Badge variant="outline" className="text-xs">
                          {repo.language}
                        </Badge>
                      )}
                      {repo.private && (
                        <Badge variant="secondary" className="text-xs">
                          Private
                        </Badge>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="py-8 text-center">
                <Github className="h-12 w-12 text-muted-foreground mx-auto mb-4 opacity-50" />
                <h3 className="text-lg font-medium mb-1">No repositories found</h3>
                <p className="text-sm text-muted-foreground">
                  {searchQuery 
                    ? `No repositories matching "${searchQuery}"`
                    : "Please make sure your GitHub account has repositories."}
                </p>
                {searchQuery && (
                  <Button 
                    variant="outline" 
                    className="mt-4"
                    onClick={() => setSearchQuery('')}
                  >
                    Clear search
                  </Button>
                )}
              </div>
            )}
          </div>
        );
        
      case 'configure-project':
        return (
          <div className="space-y-4">
            <div className="mb-4 p-3 border rounded-md bg-muted/30">
              <div className="flex items-center gap-2 mb-1">
                <Github className="h-4 w-4" />
                <span className="font-medium">{selectedRepo?.full_name}</span>
              </div>
              <div className="text-sm text-muted-foreground">
                {selectedRepo?.description || "No description available"}
              </div>
            </div>
            
            <div className="space-y-3">
              <div>
                <Label htmlFor="project-name">Project Name</Label>
                <Input
                  id="project-name"
                  value={projectDetails.name}
                  onChange={(e) => setProjectDetails({...projectDetails, name: e.target.value})}
                  className="mt-1"
                />
              </div>
              
              <div>
                <Label htmlFor="project-description">Description</Label>
                <Textarea
                  id="project-description"
                  value={projectDetails.description}
                  onChange={(e) => setProjectDetails({...projectDetails, description: e.target.value})}
                  rows={3}
                  className="mt-1"
                />
              </div>
              
              <div>
                <Label>Tech Stack</Label>
                <div className="flex flex-wrap gap-1 mt-1">
                  {selectedRepo?.language && (
                    <Badge className="bg-primary">
                      {selectedRepo.language}
                    </Badge>
                  )}
                </div>
                <p className="text-xs text-muted-foreground mt-1">
                  Main language detected from GitHub. You can edit this in project settings later.
                </p>
              </div>
            </div>
            
            <div className="flex justify-between pt-4">
              <Button
                variant="outline"
                onClick={() => setCurrentStep('select-repo')}
                disabled={isLoading}
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back
              </Button>
              
              <Button
                onClick={handleImportRepo}
                disabled={isLoading || !projectDetails.name.trim()}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Importing...
                  </>
                ) : (
                  <>
                    Import Repository
                    <ArrowRight className="h-4 w-4 ml-2" />
                  </>
                )}
              </Button>
            </div>
          </div>
        );
        
      case 'indexing':
        return (
          <div className="space-y-4">
            <ProjectIndexingStatus 
              projectId={importedProjectId!} 
              repoName={selectedRepo?.name || ''} 
            />
            
            <div className="pt-4 flex justify-end">
              <Button 
                onClick={handleComplete}
                className="bg-green-600 hover:bg-green-700"
              >
                <Check className="h-4 w-4 mr-2" />
                Complete Import
              </Button>
            </div>
          </div>
        );
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Import GitHub Repository</DialogTitle>
        </DialogHeader>

        {error && <ErrorMessage message={error} className="mb-4" />}
        
        {renderStepContent()}
      </DialogContent>
    </Dialog>
  );
}
