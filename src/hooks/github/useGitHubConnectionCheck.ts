
import { useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { GitHubOAuthConnection } from "@/types/admin/settings/github";

export function useGitHubConnectionCheck(
  setIsCheckingConnection: (isChecking: boolean) => void,
  updateConnectionFromData: (connection: GitHubOAuthConnection | null) => void
) {
  const checkConnection = useCallback(async () => {
    try {
      setIsCheckingConnection(true);
      const { data, error } = await supabase
        .from('oauth_connections')
        .select('*')
        .eq('provider', 'github')
        .single();
        
      if (error) {
        if (error.code !== 'PGRST116') { // Not found error
          console.error('Error checking GitHub connection:', error);
        }
        updateConnectionFromData(null);
        return;
      }
      
      const connection = data as GitHubOAuthConnection;
      updateConnectionFromData(connection);
    } catch (error) {
      console.error('Error checking GitHub connection:', error);
      updateConnectionFromData(null);
    } finally {
      setIsCheckingConnection(false);
    }
  }, [setIsCheckingConnection, updateConnectionFromData]);

  return { checkConnection };
}
