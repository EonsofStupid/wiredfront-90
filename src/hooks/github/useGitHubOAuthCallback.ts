
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
      console.log('Received message from popup:', event.origin, event.data);
      
      // Validate the origin to improve security
      const isValidOrigin = event.origin === window.location.origin || 
                            event.origin.includes('github.com') ||
                            event.origin.includes('lovable.app');

      if (!isValidOrigin) {
        console.log('Ignoring message from unknown origin:', event.origin);
        return;
      }
      
      // Type guard to ensure data is an object with a type property
      if (!event.data || typeof event.data !== 'object' || !('type' in event.data)) {
        console.log('Ignoring message with invalid format:', event.data);
        return;
      }
      
      const data = event.data;
      
      // Check if this is a GitHub auth message
      if (data.type === 'github-auth-success') {
        console.log('Received GitHub auth success message:', data);
        
        if (data.username) {
          console.log('Setting username from popup message:', data.username);
          setUsername(data.username);
          setConnectionStatus('connected');
          setErrorMessage(null);
          toast.success('GitHub connected successfully');
          
          // Refresh the connection state
          await checkConnection();
        }
        else {
          // If we don't have username in the message but got a success message,
          // we need to call the connection check directly
          try {
            setIsCheckingConnection(true);
            await checkConnection();
            toast.success('GitHub connected successfully');
          } catch (error) {
            console.error('Error checking GitHub connection after success message:', error);
            setConnectionStatus('error');
            setErrorMessage(`Connection check error: ${error instanceof Error ? error.message : String(error)}`);
            toast.error('GitHub connection verification failed');
          } finally {
            setIsCheckingConnection(false);
          }
        }
      } 
      else if (data.type === 'github-auth-error') {
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
