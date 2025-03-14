
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuthStore } from "@/stores/auth";
import { toast } from "sonner";

export interface GitHubRepo {
  id: number;
  name: string;
  full_name: string;
  description: string | null;
  private: boolean;
  html_url: string;
  language: string | null;
  default_branch: string;
}

export function useGitHubProjects() {
  const [isLoading, setIsLoading] = useState(false);
  const [repos, setRepos] = useState<GitHubRepo[]>([]);
  const [isImporting, setIsImporting] = useState(false);
  const { user } = useAuthStore();

  const fetchUserRepos = async () => {
    setIsLoading(true);
    try {
      const response = await supabase.functions.invoke("github-repo-management", {
        body: { 
          action: "fetch-repos"
        }
      });

      if (response.error) throw new Error(response.error.message);
      
      setRepos(response.data.repos || []);
      return response.data.repos;
    } catch (error) {
      console.error("Error fetching GitHub repos:", error);
      toast.error("Failed to fetch GitHub repositories");
      return [];
    } finally {
      setIsLoading(false);
    }
  };

  const importProject = async (
    repoFullName: string, 
    projectName: string,
    projectDescription?: string
  ) => {
    if (!user?.id) return null;
    
    setIsImporting(true);
    try {
      // Create the project in the database
      const { data: project, error } = await supabase
        .from("projects")
        .insert({
          user_id: user.id,
          name: projectName,
          description: projectDescription || "",
          github_repo: repoFullName,
          is_active: true,
          status: "active"
        })
        .select("*")
        .single();

      if (error) throw error;

      // Start RAG indexing of the repository
      startProjectIndexing(project.id, repoFullName);
      
      toast.success("Project imported successfully!");
      return project;
    } catch (error) {
      console.error("Error importing project:", error);
      toast.error("Failed to import project");
      return null;
    } finally {
      setIsImporting(false);
    }
  };

  const startProjectIndexing = async (projectId: string, repoFullName: string) => {
    try {
      // Call edge function to start indexing
      await supabase.functions.invoke("github-repo-management", {
        body: { 
          action: "index-repo", 
          projectId,
          repoFullName
        }
      });
    } catch (error) {
      console.error("Error starting project indexing:", error);
      // We don't show an error to the user as this is a background process
    }
  };

  return {
    repos,
    isLoading,
    isImporting,
    fetchUserRepos,
    importProject
  };
}
