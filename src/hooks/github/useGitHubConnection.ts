
import { useState, useEffect, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";
import { useAuthStore } from "@/stores/auth";
import { GitHubConnectionState } from "@/types/admin/settings/github";

export function useGitHubConnection() {
  const [isConnected, setIsConnected] = useState(false);
  const [isChecking, setIsChecking] = useState(true);
  const [connectionStatus, setConnectionStatus] = useState<{
    status: string;
    lastCheck: string | null;
    errorMessage: string | null;
    metadata: Record<string, any> | null;
  }>({
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
        setConnectionStatus({
          status: data.status,
          lastCheck: data.last_check,
          errorMessage: data.error_message,
          metadata: data.metadata as Record<string, any> | null
        });
        
        setIsConnected(data.status === "connected");
        
        // Type guard for metadata
        if (data.metadata && typeof data.metadata === 'object' && data.metadata !== null) {
          // Only log if metadata has a username property
          const metadata = data.metadata as Record<string, any>;
          if (metadata.username) {
            console.log(`GitHub connected as: ${metadata.username}`);
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
      const { data, error } = await supabase.functions.invoke("github-repo-management", {
        body: { action: "get-auth-url" }
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
        
        toast({
          title: "GitHub Authorization",
          description: "Please complete the GitHub authorization in the new window."
        });
      }
    } catch (error) {
      console.error("Error initiating GitHub connection:", error);
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
      // Call edge function to revoke GitHub token
      await supabase.functions.invoke("github-repo-management", {
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
