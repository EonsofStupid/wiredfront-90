
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { logger } from "@/services/chat/LoggingService";
import { validateWithZod } from "@/utils/validation";
import { githubAuthErrorSchema } from "@/schemas/github";

export function useGitHubDisconnect(
  setIsCheckingConnection: (isChecking: boolean) => void,
  updateConnectionFromData: (connection: any) => void
) {
  const disconnect = async () => {
    try {
      setIsCheckingConnection(true);
      toast.loading('Disconnecting from GitHub...');
      
      const { data, error } = await supabase.functions.invoke('github-token-management', {
        body: { action: 'revoke' }
      });
      
      if (error) {
        // Validate error structure against schema
        const validatedError = validateWithZod(
          githubAuthErrorSchema,
          error,
          { 
            context: 'GitHub Disconnect Error',
            showToast: false 
          }
        );
        
        throw validatedError || error;
      }
      
      updateConnectionFromData(null);
      toast.success('Successfully disconnected from GitHub');
      
      logger.info('GitHub connection revoked', {
        success: true
      });
      
    } catch (error) {
      console.error('Error disconnecting GitHub:', error);
      const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
      
      logger.error('GitHub disconnection failed', {
        error: errorMessage
      });
      
      toast.error(`Failed to disconnect from GitHub: ${errorMessage}`);
    } finally {
      setIsCheckingConnection(false);
      toast.dismiss();
    }
  };
  
  return { disconnect };
}
