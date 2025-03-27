
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { GitHubConnectionState } from "@/types/admin/settings/github";
import { logger } from "@/services/chat/LoggingService";

interface UseGitHubConnectProps {
  setConnectionStatus: (status: GitHubConnectionState) => void;
  setErrorMessage: (message: string | null) => void;
  setDebugInfo: (info: Record<string, any> | null) => void;
}

export function useGitHubConnect({
  setConnectionStatus,
  setErrorMessage,
  setDebugInfo
}: UseGitHubConnectProps) {
  const [isInitializing, setIsInitializing] = useState<boolean>(false);
  
  const connect = async () => {
    try {
      setConnectionStatus('connecting');
      setErrorMessage(null);
      setIsInitializing(true);
      
      // Check if the Supabase function is properly configured
      const configCheck = await supabase.functions.invoke('github-oauth-init', {
        body: { check_only: true }
      });
      
      if (configCheck.error || !configCheck.data?.status) {
        throw new Error(configCheck.error?.message || 'GitHub OAuth is not properly configured');
      }
      
      logger.info('GitHub OAuth configuration check passed', {
        success: true,
        trace_id: configCheck.data?.trace_id
      });
      
      // Get the current origin for the redirect URL
      const redirectUrl = `${window.location.origin}/github-callback`;
      
      // Initialize the OAuth process
      const { data, error } = await supabase.functions.invoke('github-oauth-init', {
        body: { redirect_url: redirectUrl }
      });
      
      if (error) {
        throw new Error(error.message || 'Failed to initialize GitHub OAuth');
      }
      
      if (!data?.url) {
        throw new Error('No GitHub authorization URL returned');
      }
      
      // Log the successful initialization
      logger.info('GitHub OAuth initialized', {
        trace_id: data.trace_id
      });
      
      // Store debug info
      setDebugInfo({
        trace_id: data.trace_id,
        state: data.state?.substring(0, 10) + '...',
        timestamp: new Date().toISOString()
      });
      
      // Open GitHub login in a popup window
      const width = 600;
      const height = 800;
      const left = window.screenX + (window.outerWidth - width) / 2;
      const top = window.screenY + (window.outerHeight - height) / 2;
      
      const popup = window.open(
        data.url,
        'github-oauth',
        `width=${width},height=${height},left=${left},top=${top}`
      );
      
      // Check if popup was blocked
      if (!popup || popup.closed || typeof popup.closed === 'undefined') {
        setConnectionStatus('error');
        setErrorMessage('The popup window was blocked. Please allow popups for this site.');
        return;
      }
      
      // Log the popup opening
      logger.info('GitHub OAuth popup opened', {
        trace_id: data.trace_id
      });
      
      // The popup will redirect to our callback page which will send a message back
      // The message handling is done in useGitHubOAuthCallback hook
      
    } catch (error) {
      console.error('Error initializing GitHub connection:', error);
      setConnectionStatus('error');
      
      const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
      setErrorMessage(errorMessage);
      
      logger.error('GitHub OAuth initialization failed', {
        error: errorMessage
      });
      
      toast.error(`GitHub connection failed: ${errorMessage}`);
    } finally {
      setIsInitializing(false);
    }
  };
  
  return {
    connect,
    isInitializing
  };
}
