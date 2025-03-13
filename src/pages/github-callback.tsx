
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const GitHubCallback = () => {
  const navigate = useNavigate();

  useEffect(() => {
    // This page will never be seen by the user
    // It's just a placeholder to catch the GitHub callback
    // The actual callback handling is done in the GitHub OAuth callback edge function
    // which returns HTML that will close this page automatically
    
    // Just in case something goes wrong with the callback, 
    // automatically navigate back to home after a short delay
    const timeout = setTimeout(() => {
      window.close();
      navigate('/');
    }, 5000);
    
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
