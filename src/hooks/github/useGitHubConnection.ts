
import { useState, useEffect, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { useAuthStore } from "@/stores/auth";
import { 
  GitHubConnectionState, 
  GitHubConnectionStatusProps,
  normalizeConnectionStatus
} from "@/types/admin/settings/github";

export function useGitHubConnection() {
  const [isConnected, setIsConnected] = useState(false);
  const [isChecking, setIsChecking] = useState(true);
  const [connectionStatus, setConnectionStatus] = useState<GitHubConnectionStatusProps>({
    status: "unknown",
    lastCheck: null,
    errorMessage: null,
    metadata: null
  });
  const [githubUsername, setGithubUsername] = useState<string | null>(null);
  const [linkedAccounts, setLinkedAccounts] = useState<Array<{
    id: string;
    username: string;
    default: boolean;
  }>>([]);
  
  const { user } = useAuthStore();

  // Check connection status when component mounts
  useEffect(() => {
    if (user?.id) {
      checkConnectionStatus();
      fetchLinkedAccounts();
    }
  }, [user?.id]);

  // Fetch the current GitHub connection status
  const checkConnectionStatus = useCallback(async () => {
    if (!user?.id) return;
    
    setIsChecking(true);
    try {
      const { data, error } = await supabase.functions.invoke("github-token-management", {
        body: { 
          action: "status"
        }
      });
      
      if (error) throw error;
      
      // Set isConnected based on the response
      setIsConnected(data.isConnected);
      
      // Set GitHub username
      setGithubUsername(data.username || null);
      
      // Normalize and set connection status
      setConnectionStatus({
        status: data.status || "unknown",
        lastCheck: data.lastChecked || null,
        errorMessage: data.error || null,
        metadata: {
          username: data.username,
          scopes: data.scopes,
          ...data
        }
      });
    } catch (error) {
      console.error("Error checking GitHub connection status:", error);
      setIsConnected(false);
      setConnectionStatus({
        status: "error",
        lastCheck: new Date().toISOString(),
        errorMessage: error instanceof Error ? error.message : "Unknown error checking connection status",
        metadata: null
      });
    } finally {
      setIsChecking(false);
    }
  }, [user?.id]);

  // Fetch all linked GitHub accounts for the user
  const fetchLinkedAccounts = useCallback(async () => {
    if (!user?.id) return;
    
    try {
      const { data, error } = await supabase
        .from("oauth_connections")
        .select("id, provider, account_username, metadata")
        .eq("user_id", user.id)
        .eq("provider", "github");
      
      if (error) throw error;
      
      if (data && data.length > 0) {
        const accounts = data.map(account => ({
          id: account.id,
          username: account.account_username || "Unknown",
          default: account.metadata?.default || false
        }));
        
        setLinkedAccounts(accounts);
      } else {
        setLinkedAccounts([]);
      }
    } catch (error) {
      console.error("Error fetching linked GitHub accounts:", error);
    }
  }, [user?.id]);

  // Initiate GitHub OAuth connection
  const connectGitHub = async () => {
    try {
      setConnectionStatus({
        ...connectionStatus,
        status: "connecting"
      });
      
      // Start the OAuth flow
      const { data, error } = await supabase.functions.invoke("github-oauth-init", {
        body: { 
          redirect_url: `${window.location.origin}/github-callback` 
        }
      });
      
      if (error) throw error;
      
      if (!data.url) {
        throw new Error("No GitHub authorization URL returned");
      }
      
      // Open GitHub login in a popup window
      const width = 600;
      const height = 800;
      const left = window.screenX + (window.outerWidth - width) / 2;
      const top = window.screenY + (window.outerHeight - height) / 2;
      
      const popup = window.open(
        data.url,
        "github-oauth",
        `width=${width},height=${height},left=${left},top=${top}`
      );
      
      // Check if popup was blocked
      if (!popup || popup.closed || typeof popup.closed === 'undefined') {
        throw new Error("The popup window was blocked. Please allow popups for this site.");
      }
      
      // The popup will handle the redirect and the popup will close when complete
      // We'll need to check the connection status again after a short delay
      setTimeout(() => {
        checkConnectionStatus();
        fetchLinkedAccounts();
      }, 2000);
    } catch (error) {
      console.error("Error initiating GitHub connection:", error);
      
      setConnectionStatus({
        status: "error",
        lastCheck: new Date().toISOString(),
        errorMessage: error instanceof Error ? error.message : "Unknown error initiating connection",
        metadata: null
      });
      
      toast.error("Failed to connect to GitHub");
    }
  };

  // Disconnect from GitHub
  const disconnectGitHub = async (accountId?: string) => {
    try {
      setIsChecking(true);
      
      const { error } = await supabase.functions.invoke("github-token-management", {
        body: { 
          action: "revoke",
          accountId: accountId // If not provided, it will revoke the default account
        }
      });
      
      if (error) throw error;
      
      await checkConnectionStatus();
      await fetchLinkedAccounts();
      
      toast.success("Successfully disconnected from GitHub");
    } catch (error) {
      console.error("Error disconnecting from GitHub:", error);
      toast.error("Failed to disconnect from GitHub");
    } finally {
      setIsChecking(false);
    }
  };

  // Set a GitHub account as the default for the user
  const setDefaultGitHubAccount = async (accountId: string) => {
    if (!user?.id) return;
    
    try {
      // Update the metadata for the selected account
      const { error: updateError } = await supabase
        .from("oauth_connections")
        .update({ 
          metadata: { default: true }
        })
        .eq("id", accountId)
        .eq("user_id", user.id);
      
      if (updateError) throw updateError;
      
      // Reset 'default' for all other accounts
      const { error: resetError } = await supabase
        .from("oauth_connections")
        .update({ 
          metadata: { default: false }
        })
        .eq("user_id", user.id)
        .eq("provider", "github")
        .neq("id", accountId);
      
      if (resetError) throw resetError;
      
      await fetchLinkedAccounts();
      toast.success("Default GitHub account updated");
    } catch (error) {
      console.error("Error setting default GitHub account:", error);
      toast.error("Failed to update default GitHub account");
    }
  };
  
  return {
    isConnected,
    isChecking,
    connectionStatus,
    githubUsername,
    linkedAccounts,
    connectGitHub,
    disconnectGitHub,
    checkConnectionStatus,
    fetchLinkedAccounts,
    setDefaultGitHubAccount
  };
}
