
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const GitHubCallback = () => {
  const navigate = useNavigate();

  useEffect(() => {
    // Get URL parameters
    const urlParams = new URLSearchParams(window.location.search);
    const code = urlParams.get('code');
    const state = urlParams.get('state');
    
    // Send a message to the parent window with the auth status
    if (code && state) {
      console.log('Successfully received GitHub code, sending to parent window');
      if (window.opener) {
        window.opener.postMessage({ 
          type: 'github-auth-success',
          code,
          state
        }, '*');
      }
    } else if (urlParams.get('error')) {
      console.error('GitHub OAuth error:', urlParams.get('error_description'));
      if (window.opener) {
        window.opener.postMessage({ 
          type: 'github-auth-error', 
          error: urlParams.get('error_description') || 'Authentication failed'
        }, '*');
      }
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
