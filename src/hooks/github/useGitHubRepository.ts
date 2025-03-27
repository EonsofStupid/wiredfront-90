
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export interface GitHubRepoData {
  repoUrl: string;
  repoName: string;
  repoOwner: string;
}

export function useGitHubRepository() {
  const [isCreating, setIsCreating] = useState(false);
  const [isChecking, setIsChecking] = useState(false);
  const [connectionStatus, setConnectionStatus] = useState<string | null>(null);

  const createRepository = async (
    projectName: string,
    projectId: string,
    description?: string
  ): Promise<GitHubRepoData | null> => {
    setIsCreating(true);
    try {
      const user = await supabase.auth.getUser();
      const userId = user.data.user?.id;
      
      if (!userId) {
        throw new Error("User not authenticated");
      }

      const response = await supabase.functions.invoke("github-repo-management", {
        body: { 
          action: "create-repo", 
          payload: {
            userId,
            projectId,
            projectName,
            description
          }
        }
      });

      if (response.error) {
        throw new Error(response.error.message || "Failed to create GitHub repository");
      }
      
      toast.success("GitHub repository created successfully");
      return response.data;
    } catch (error) {
      console.error("Error creating GitHub repository:", error);
      toast.error(error.message || "Failed to create GitHub repository");
      return null;
    } finally {
      setIsCreating(false);
    }
  };

  const checkGitHubStatus = async (): Promise<{
    connected: boolean;
    status: string;
    username: string | null;
  } | null> => {
    setIsChecking(true);
    try {
      const user = await supabase.auth.getUser();
      const userId = user.data.user?.id;
      
      if (!userId) {
        throw new Error("User not authenticated");
      }

      const response = await supabase.functions.invoke("github-repo-management", {
        body: { 
          action: "check-github-status", 
          payload: {
            userId
          }
        }
      });

      if (response.error) {
        throw new Error(response.error.message || "Failed to check GitHub status");
      }

      setConnectionStatus(response.data.status);
      return response.data;
    } catch (error) {
      console.error("Error checking GitHub status:", error);
      return null;
    } finally {
      setIsChecking(false);
    }
  };

  return {
    createRepository,
    checkGitHubStatus,
    isCreating,
    isChecking,
    connectionStatus
  };
}
