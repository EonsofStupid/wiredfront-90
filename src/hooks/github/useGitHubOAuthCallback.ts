
import { useEffect } from "react";
import { toast } from "sonner";

type CallbackState = {
  setConnectionStatus: (status: 'idle' | 'connecting' | 'connected' | 'error') => void;
  setErrorMessage: (message: string | null) => void;
  setUsername: (username: string | null) => void;
  checkConnection: () => Promise<void>;
};

export function useGitHubOAuthCallback({
  setConnectionStatus,
  setErrorMessage,
  setUsername,
  checkConnection
}: CallbackState) {
  useEffect(() => {
    const handleOAuthMessage = (event: MessageEvent) => {
      console.log('Message received from popup:', event.data);
      
      if (event.data && event.data.type === 'github-auth-success') {
        console.log('GitHub auth success message received:', event.data);
        setConnectionStatus('connected');
        setErrorMessage(null);
        
        // Update username if provided in the message
        if (event.data.username) {
          setUsername(event.data.username);
        }
        
        toast.success('Connected to GitHub successfully');
        checkConnection(); // Refresh connection data
      } else if (event.data && event.data.type === 'github-auth-error') {
        console.error('GitHub auth error:', event.data.error);
        setConnectionStatus('error');
        setErrorMessage(event.data.error);
        toast.error(`GitHub connection failed: ${event.data.error}`);
      }
    };

    window.addEventListener('message', handleOAuthMessage);
    return () => window.removeEventListener('message', handleOAuthMessage);
  }, [checkConnection, setConnectionStatus, setErrorMessage, setUsername]);
}
