
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

type ConnectionState = {
  setConnectionStatus: (status: 'idle' | 'connecting' | 'connected' | 'error') => void;
  setErrorMessage: (message: string | null) => void;
  setDebugInfo: (info: any) => void;
};

export function useGitHubConnect({
  setConnectionStatus,
  setErrorMessage,
  setDebugInfo
}: ConnectionState) {
  const connect = async () => {
    try {
      setConnectionStatus('connecting');
      setErrorMessage(null);
      setDebugInfo(null);
      
      // Prepare the callback URL (current origin)
      const callbackUrl = `${window.location.origin}/github-callback`;
      console.log("Using callback URL:", callbackUrl);
      
      // First check if the GitHub client ID is configured
      console.log("Checking GitHub OAuth configuration...");
      const { data: configCheck, error: configError } = await supabase.functions.invoke('github-oauth-init', {
        body: { 
          redirect_url: callbackUrl,
          check_only: true
        }
      });
      
      // Log the full response for debugging
      console.log("Config check response:", configCheck, configError);
      
      if (configError) {
        console.error('GitHub OAuth configuration error:', configError);
        setErrorMessage(`Configuration error: ${configError.message || String(configError)}`);
        setConnectionStatus('error');
        toast.error(`GitHub configuration error: ${configError.message || String(configError)}`);
        return;
      }
      
      if (configCheck?.error) {
        console.error('GitHub OAuth configuration error:', configCheck.error);
        
        // Save debug info for troubleshooting
        if (configCheck.debug) {
          setDebugInfo(configCheck.debug);
        }
        
        setErrorMessage(configCheck.error);
        setConnectionStatus('error');
        toast.error(`GitHub configuration error: ${configCheck.error}`);
        return;
      }
      
      // If config check passed, call the GitHub OAuth initialization edge function
      console.log("Generating GitHub OAuth URL...");
      const response = await supabase.functions.invoke('github-oauth-init', {
        body: { 
          redirect_url: callbackUrl
        }
      });

      console.log('GitHub OAuth init response:', response);
      
      if (response.error) {
        console.error('Error starting GitHub OAuth flow:', response.error);
        toast.error(`Failed to start GitHub OAuth flow: ${response.error.message || String(response.error)}`);
        setConnectionStatus('error');
        setErrorMessage(response.error.message || String(response.error));
        return;
      }
      
      const { data } = response;
      
      // Log the URL to help with debugging
      console.log('GitHub OAuth URL generated:', data?.url);
      
      if (!data || !data.url) {
        const errorMsg = data?.error || 'No OAuth URL returned from the server';
        console.error(errorMsg);
        toast.error('Failed to generate GitHub OAuth URL');
        setConnectionStatus('error');
        setErrorMessage(errorMsg);
        return;
      }

      // Open GitHub auth in a popup with precise dimensions
      const width = 600;
      const height = 700;
      const left = window.screenX + (window.outerWidth - width) / 2;
      const top = window.screenY + (window.outerHeight - height) / 2;
      
      console.log('Opening popup with URL:', data.url);
      
      const popup = window.open(
        data.url,
        'Github Authorization',
        `width=${width},height=${height},left=${left},top=${top},status=yes,menubar=no,toolbar=no`
      );
      
      if (!popup || popup.closed || typeof popup.closed === 'undefined') {
        console.error('Popup was blocked or could not be opened');
        toast.error('Popup was blocked. Please allow popups for this site.');
        setConnectionStatus('error');
        setErrorMessage('Popup was blocked. Please allow popups for this site.');
        return;
      }
      
      // Start an interval to check if popup is closed without completing auth
      const checkPopupClosed = setInterval(() => {
        if (popup.closed) {
          clearInterval(checkPopupClosed);
          // If connection wasn't established when popup closed and we're still in connecting state
          setTimeout(() => {
            // Check if we're still connecting (not if we succeeded or failed already)
            if (document.hidden) {
              // If the tab is not visible, we might have missed a message
              // Will reset to idle on next checkConnection
              return;
            }
            // Fix here: Don't use a function with setConnectionStatus, use direct value
            setConnectionStatus('idle');
          }, 1000);
        }
      }, 1000);
    } catch (error) {
      console.error('Error connecting to GitHub:', error);
      toast.error('Failed to connect to GitHub');
      setConnectionStatus('error');
      setErrorMessage(error instanceof Error ? error.message : String(error));
    }
  };

  return { connect };
}
