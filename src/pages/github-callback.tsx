
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const GitHubCallback = () => {
  const navigate = useNavigate();

  useEffect(() => {
    // This page will automatically close as the callback HTML sets window.close()
    // This is just a fallback in case something goes wrong with the callback
    const timeout = setTimeout(() => {
      window.close();
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
