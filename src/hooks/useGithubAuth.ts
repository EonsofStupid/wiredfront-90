import { useState, useEffect } from 'react';

export const useGithubAuth = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const response = await fetch('/api/github/check-auth');
        const { authenticated } = await response.json();
        setIsAuthenticated(authenticated);
      } catch (error) {
        console.error('Error checking GitHub auth:', error);
        setIsAuthenticated(false);
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, []);

  return { isAuthenticated, loading };
}; 