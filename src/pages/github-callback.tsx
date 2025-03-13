
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';

const GitHubCallback = () => {
  const navigate = useNavigate();
  const [status, setStatus] = useState<'processing' | 'success' | 'error'>('processing');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    const handleCallback = async () => {
      // Get URL parameters
      const urlParams = new URLSearchParams(window.location.search);
      const code = urlParams.get('code');
      const state = urlParams.get('state');
      const error = urlParams.get('error');
      const errorDescription = urlParams.get('error_description');
      
      console.log('GitHub callback loaded:', { 
        hasCode: !!code, 
        hasState: !!state,
        error,
        errorDescription
      });
      
      // If there's an error, show it and inform the parent window
      if (error) {
        console.error('GitHub OAuth error:', errorDescription);
        setStatus('error');
        setErrorMessage(errorDescription || 'Authentication failed');
        
        if (window.opener) {
          window.opener.postMessage({ 
            type: 'github-auth-error', 
            error: errorDescription || 'Authentication failed'
          }, '*');
        }
        toast.error(`GitHub Authentication Error: ${errorDescription || 'Unknown error'}`);
        return;
      }
      
      // If we don't have a code and state, something went wrong
      if (!code || !state) {
        console.error('Invalid GitHub callback parameters');
        setStatus('error');
        setErrorMessage('Invalid response from GitHub');
        
        if (window.opener) {
          window.opener.postMessage({ 
            type: 'github-auth-error', 
            error: 'Invalid response from GitHub'
          }, '*');
        }
        toast.error('GitHub Authentication Failed: Invalid response');
        return;
      }
      
      try {
        // Call our edge function to exchange the code for a token and save in the database
        const { data, error } = await supabase.functions.invoke('github-oauth-callback', {
          body: { code, state }
        });
        
        if (error) {
          throw new Error(error.message || 'Failed to exchange GitHub code');
        }
        
        console.log('Successfully exchanged GitHub code for token:', data);
        setStatus('success');
        
        // Notify the parent window of success
        if (window.opener) {
          window.opener.postMessage({ 
            type: 'github-auth-success',
            username: data?.username || null
          }, '*');
        }
        
        toast.success('GitHub authentication successful!');
      } catch (err) {
        console.error('Error exchanging GitHub code:', err);
        setStatus('error');
        setErrorMessage(err instanceof Error ? err.message : 'Failed to complete GitHub authentication');
        
        if (window.opener) {
          window.opener.postMessage({ 
            type: 'github-auth-error', 
            error: err instanceof Error ? err.message : 'Failed to complete GitHub authentication'
          }, '*');
        }
        
        toast.error('GitHub Authentication Failed: Unable to exchange code for token');
      }
    };
    
    handleCallback();
    
    // Close this window automatically after a short delay
    const timeout = setTimeout(() => {
      if (window.opener && status !== 'processing') {
        window.close();
      }
      // If window doesn't close (some browsers prevent this), navigate back to home
      if (status !== 'processing') {
        navigate('/');
      }
    }, status === 'error' ? 5000 : 3000); // Longer delay for errors so users can read the message
    
    return () => clearTimeout(timeout);
  }, [navigate, status]);

  return (
    <div className="flex items-center justify-center min-h-screen bg-background">
      <div className="max-w-md w-full p-6 bg-card rounded-lg shadow-lg border border-border">
        <div className="text-center">
          <h1 className="text-xl font-bold mb-4">GitHub Authentication</h1>
          
          {status === 'processing' && (
            <>
              <div className="flex justify-center mb-4">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
              </div>
              <p>Processing your GitHub authentication...</p>
            </>
          )}
          
          {status === 'success' && (
            <>
              <div className="flex justify-center mb-4 text-green-500">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <p className="text-green-500 font-medium mb-2">Successfully connected to GitHub!</p>
            </>
          )}
          
          {status === 'error' && (
            <>
              <div className="flex justify-center mb-4 text-red-500">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </div>
              <p className="text-red-500 font-medium mb-2">Authentication Error</p>
              {errorMessage && <p className="text-sm text-muted-foreground mb-4">{errorMessage}</p>}
            </>
          )}
          
          <p className="text-sm text-muted-foreground mt-4">This window will close automatically.</p>
        </div>
      </div>
    </div>
  );
};

export default GitHubCallback;
