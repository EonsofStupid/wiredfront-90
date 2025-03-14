
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export type GitHubConnectionState = 'idle' | 'connecting' | 'connected' | 'error';

export function useGitHubConnection() {
  const [isConnected, setIsConnected] = useState(false);
  const [username, setUsername] = useState<string | null>(null);
  const [connectionStatus, setConnectionStatus] = useState<GitHubConnectionState>('idle');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isCheckingConnection, setIsCheckingConnection] = useState(false);

  useEffect(() => {
    checkConnection();
  }, []);

  const checkConnection = async () => {
    setIsCheckingConnection(true);
    try {
      // First check if we have a connection record in the database
      const { data: connectionData, error: connectionError } = await supabase
        .from('github_connection_status')
        .select('*')
        .eq('user_id', (await supabase.auth.getUser()).data.user?.id || '')
        .single();

      if (!connectionError && connectionData && connectionData.status === 'connected') {
        setIsConnected(true);
        setUsername(connectionData.metadata?.username || null);
        setConnectionStatus('connected');
        return;
      }

      // Check with the GitHub endpoint
      const response = await supabase.functions.invoke("github-repo-management", {
        body: { 
          action: "check-github-status", 
          payload: {
            userId: (await supabase.auth.getUser()).data.user?.id
          }
        }
      });

      if (response.error) {
        throw new Error(response.error.message);
      }

      if (response.data.connected) {
        setIsConnected(true);
        setUsername(response.data.username);
        setConnectionStatus('connected');
      } else {
        setIsConnected(false);
        setUsername(null);
        setConnectionStatus('idle');
      }
    } catch (error) {
      console.error("Error checking GitHub connection:", error);
      setIsConnected(false);
      setConnectionStatus('idle');
    } finally {
      setIsCheckingConnection(false);
    }
  };

  const connect = async () => {
    setConnectionStatus('connecting');
    setErrorMessage(null);
    
    try {
      // In a real implementation, this would use OAuth to connect to GitHub
      // For demonstration, we're simulating the connection
      toast.info("GitHub OAuth flow would start here");
      
      // Simulate a delay for the OAuth flow
      setTimeout(() => {
        // This would be the callback handler after successful OAuth
        setIsConnected(true);
        setUsername("github_user"); // In real app, this would come from GitHub
        setConnectionStatus('connected');
        toast.success("Connected to GitHub successfully");
        
        // In a real app, this data would come from the OAuth response
        saveConnectionStatus({
          status: 'connected',
          username: 'github_user',
          scopes: ['repo']
        });
      }, 1500);
    } catch (error) {
      console.error("Error connecting to GitHub:", error);
      setErrorMessage(error.message || "Failed to connect to GitHub");
      setConnectionStatus('error');
      toast.error("Failed to connect to GitHub");
    }
  };

  const disconnect = async () => {
    try {
      // In a real implementation, this would revoke the GitHub OAuth token
      // For demonstration, we're just updating the state
      
      // Update the connection status in the database
      const { error } = await supabase
        .from('github_connection_status')
        .update({
          status: 'disconnected',
          last_check: new Date().toISOString(),
          metadata: null
        })
        .eq('user_id', (await supabase.auth.getUser()).data.user?.id || '');
      
      if (error) throw error;
      
      setIsConnected(false);
      setUsername(null);
      setConnectionStatus('idle');
      toast.success("Disconnected from GitHub");
    } catch (error) {
      console.error("Error disconnecting from GitHub:", error);
      toast.error("Failed to disconnect from GitHub");
    }
  };

  const saveConnectionStatus = async (data: {
    status: string;
    username: string;
    scopes: string[];
  }) => {
    try {
      const userId = (await supabase.auth.getUser()).data.user?.id;
      if (!userId) return;
      
      // Check if we already have a record
      const { data: existingData, error: checkError } = await supabase
        .from('github_connection_status')
        .select('id')
        .eq('user_id', userId)
        .maybeSingle();
      
      if (checkError && checkError.code !== 'PGRST116') {
        throw checkError;
      }
      
      if (existingData) {
        // Update existing record
        const { error } = await supabase
          .from('github_connection_status')
          .update({
            status: data.status,
            last_check: new Date().toISOString(),
            metadata: {
              username: data.username,
              scopes: data.scopes,
              connected_at: new Date().toISOString()
            }
          })
          .eq('user_id', userId);
        
        if (error) throw error;
      } else {
        // Insert new record
        const { error } = await supabase
          .from('github_connection_status')
          .insert({
            user_id: userId,
            status: data.status,
            metadata: {
              username: data.username,
              scopes: data.scopes,
              connected_at: new Date().toISOString()
            }
          });
        
        if (error) throw error;
      }
    } catch (error) {
      console.error("Error saving GitHub connection status:", error);
    }
  };

  return {
    isConnected,
    username,
    connectionStatus,
    errorMessage,
    isCheckingConnection,
    connect,
    disconnect,
    checkConnection
  };
}
