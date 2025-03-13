
import { useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface OAuthCallbackProps {
  setConnectionStatus: (status: 'idle' | 'connecting' | 'connected' | 'error') => void;
  setErrorMessage: (message: string | null) => void;
  setUsername: (username: string | null) => void;
  checkConnection: () => Promise<void>;
  setIsCheckingConnection: (isChecking: boolean) => void;
}

export function useGitHubOAuthCallback({
  setConnectionStatus,
  setErrorMessage,
  setUsername,
  checkConnection,
  setIsCheckingConnection
}: OAuthCallbackProps) {
  useEffect(() => {
    // Handle messages from the OAuth popup window
    const handleOAuthMessage = async (event: MessageEvent) => {
      // Make sure the message is from our own domain
      if (event.origin !== window.location.origin) {
        return;
      }
      
      const data = event.data;
      
      // Check if this is a GitHub auth message
      if (data?.type === 'github-auth-success') {
        console.log('Received GitHub auth success message:', data);
        
        try {
          setIsCheckingConnection(true);
          
          // Exchange the code for a token on the server
          const { error } = await supabase.functions.invoke('github-oauth-callback', {
            body: {
              code: data.code,
              state: data.state
            }
          });
          
          if (error) {
            console.error('Error completing GitHub OAuth:', error);
            setConnectionStatus('error');
            setErrorMessage(`OAuth callback error: ${error.message || error}`);
            toast.error('GitHub connection failed');
          } else {
            console.log('GitHub OAuth completed successfully');
            setConnectionStatus('connected');
            setErrorMessage(null);
            toast.success('GitHub connected successfully');
            
            // Refresh the connection state
            await checkConnection();
          }
        } catch (error) {
          console.error('Error in GitHub OAuth callback processing:', error);
          setConnectionStatus('error');
          setErrorMessage(`Callback processing error: ${error instanceof Error ? error.message : String(error)}`);
          toast.error('GitHub connection failed');
        } finally {
          setIsCheckingConnection(false);
        }
      } 
      else if (data?.type === 'github-auth-error') {
        console.error('Received GitHub auth error message:', data);
        setConnectionStatus('error');
        setErrorMessage(data.error || 'Authentication failed');
        setIsCheckingConnection(false);
        toast.error(`GitHub authentication failed: ${data.error || 'Unknown error'}`);
      }
    };
    
    window.addEventListener('message', handleOAuthMessage);
    
    return () => {
      window.removeEventListener('message', handleOAuthMessage);
    };
  }, [setConnectionStatus, setErrorMessage, setUsername, checkConnection, setIsCheckingConnection]);
}
