
import { useState, useEffect, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";
import { useAuthStore } from "@/stores/auth";
import { 
  GitHubConnectionState, 
  GitHubConnectionStatus,
  GitHubConnectionStatusProps,
  normalizeConnectionStatus,
  isConnectionStatusObject
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
  
  const { toast } = useToast();
  const { user } = useAuthStore();

  const checkConnectionStatus = useCallback(async () => {
    if (!user?.id) return;
    
    setIsChecking(true);
    try {
      const { data, error } = await supabase
        .from("github_connection_status")
        .select("*")
        .eq("user_id", user.id)
        .single();
      
      if (error && error.code !== "PGRST116") {
        throw error;
      }
      
      if (data) {
        // Transform snake_case to camelCase
        const normalizedStatus = normalizeConnectionStatus(data as GitHubConnectionStatus);
        setConnectionStatus(normalizedStatus);
        setIsConnected(normalizedStatus.status === "connected");
        
        // Type guard for metadata
        if (normalizedStatus.metadata && typeof normalizedStatus.metadata === 'object' && normalizedStatus.metadata !== null) {
          // Only log if metadata has a username property
          if ('username' in normalizedStatus.metadata) {
            console.log(`GitHub connected as: ${normalizedStatus.metadata.username}`);
          }
        }
      } else {
        // No entry found, user is not connected
        setIsConnected(false);
        setConnectionStatus({
          status: "disconnected",
          lastCheck: null,
          errorMessage: null,
          metadata: null
        });
      }
    } catch (error) {
      console.error("Error checking GitHub connection status:", error);
      setIsConnected(false);
    } finally {
      setIsChecking(false);
    }
  }, [user?.id]);

  const connectGitHub = async () => {
    try {
      const { data, error } = await supabase.functions.invoke("github-oauth-init", {
        body: { returnUrl: window.location.origin }
      });
      
      if (error) throw error;
      
      if (data?.authUrl) {
        // Open GitHub OAuth flow in a new window
        window.open(data.authUrl, "_blank", "width=800,height=600");
        
        // Update local status to pending
        await supabase
          .from("github_connection_status")
          .upsert({
            user_id: user?.id,
            status: "pending",
            last_check: new Date().toISOString()
          });
        
        setConnectionStatus({
          status: "connecting",
          lastCheck: new Date().toISOString(),
          errorMessage: null,
          metadata: null
        });
        
        toast({
          title: "GitHub Authorization",
          description: "Please complete the GitHub authorization in the new window."
        });
      }
    } catch (error) {
      console.error("Error initiating GitHub connection:", error);
      
      setConnectionStatus({
        status: "error",
        lastCheck: new Date().toISOString(),
        errorMessage: error instanceof Error ? error.message : "Unknown error",
        metadata: null
      });
      
      toast({
        title: "Connection Failed",
        description: "Could not connect to GitHub. Please try again.",
        variant: "destructive"
      });
    }
  };

  const disconnectGitHub = async () => {
    if (!user?.id) return;
    
    try {
      // Set status to disconnecting
      setConnectionStatus({
        status: "connecting", // Reuse connecting state for disconnecting UI
        lastCheck: new Date().toISOString(),
        errorMessage: null,
        metadata: connectionStatus.metadata
      });
      
      // Call edge function to revoke GitHub token
      await supabase.functions.invoke("github-oauth-init", {
        body: { action: "disconnect" }
      });
      
      // Update status in database
      await supabase
        .from("github_connection_status")
        .upsert({
          user_id: user.id,
          status: "disconnected",
          last_check: new Date().toISOString(),
          metadata: null
        });
      
      setIsConnected(false);
      setConnectionStatus({
        status: "disconnected",
        lastCheck: new Date().toISOString(),
        errorMessage: null,
        metadata: null
      });
      
      toast({
        title: "Disconnected",
        description: "Your GitHub account has been disconnected."
      });
    } catch (error) {
      console.error("Error disconnecting from GitHub:", error);
      
      setConnectionStatus({
        status: "error",
        lastCheck: new Date().toISOString(),
        errorMessage: error instanceof Error ? error.message : "Unknown error",
        metadata: connectionStatus.metadata
      });
      
      toast({
        title: "Disconnection Failed",
        description: "Could not disconnect from GitHub. Please try again.",
        variant: "destructive"
      });
    }
  };

  // Poll for status changes when status is pending
  useEffect(() => {
    let intervalId: NodeJS.Timeout;
    
    if (connectionStatus.status === "pending") {
      intervalId = setInterval(checkConnectionStatus, 5000);
    }
    
    return () => {
      if (intervalId) clearInterval(intervalId);
    };
  }, [connectionStatus.status, checkConnectionStatus]);

  // Check connection status on mount and when user changes
  useEffect(() => {
    if (user?.id) {
      checkConnectionStatus();
    } else {
      setIsConnected(false);
      setIsChecking(false);
    }
  }, [user?.id, checkConnectionStatus]);

  return {
    isConnected,
    isChecking,
    connectionStatus,
    connectGitHub,
    disconnectGitHub,
    refreshStatus: checkConnectionStatus
  };
}
