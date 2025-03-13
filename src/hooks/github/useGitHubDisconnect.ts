
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export function useGitHubDisconnect(
  setIsCheckingConnection: (isChecking: boolean) => void,
  updateConnectionFromData: (connection: null) => void
) {
  const disconnect = async () => {
    try {
      setIsCheckingConnection(true);
      const { error } = await supabase
        .from('oauth_connections')
        .delete()
        .eq('provider', 'github');
        
      if (error) throw error;
      
      updateConnectionFromData(null);
      toast.success('Disconnected from GitHub');
    } catch (error) {
      console.error('Error disconnecting from GitHub:', error);
      toast.error('Failed to disconnect from GitHub');
    } finally {
      setIsCheckingConnection(false);
    }
  };

  return { disconnect };
}
