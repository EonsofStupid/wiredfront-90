import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';

const GitHubCallback = () => {
  const navigate = useNavigate();

  useEffect(() => {
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
      if (window.opener) {
        window.opener.postMessage({ 
          type: 'github-auth-error', 
          error: errorDescription || 'Authentication failed'
        }, '*');
      }
      toast.error(`GitHub Authentication Error: ${errorDescription || 'Unknown error'}`);
    }
    // If we have a code and state, it's a successful authentication
    else if (code && state) {
      console.log('Successfully received GitHub code, sending to parent window');
      if (window.opener) {
        window.opener.postMessage({ 
          type: 'github-auth-success',
          code,
          state
        }, '*');
      }
      toast.success('GitHub authentication successful!');
    } 
    // Otherwise, something else went wrong
    else {
      console.error('Invalid GitHub callback parameters');
      if (window.opener) {
        window.opener.postMessage({ 
          type: 'github-auth-error', 
          error: 'Invalid response from GitHub'
        }, '*');
      }
      toast.error('GitHub Authentication Failed: Invalid response');
    }

    // Close this window automatically after a short delay
    const timeout = setTimeout(() => {
      window.close();
      // If window doesn't close (some browsers prevent this), navigate back to home
      navigate('/');
    }, 3000);
    
    return () => clearTimeout(timeout);
  }, [navigate]);

  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="text-center">
        <h1 className="text-xl font-bold mb-2">GitHub Authentication</h1>
        <p>Processing your GitHub authentication...</p>
        <p className="text-sm text-muted-foreground mt-4">This window will close automatically.</p>
      </div>
    </div>
  );
};

export default GitHubCallback;
