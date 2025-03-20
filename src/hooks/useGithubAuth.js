import { useState, useEffect } from 'react';
export const useGithubAuth = () => {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [loading, setLoading] = useState(true);
    useEffect(() => {
        const checkAuth = async () => {
            try {
                setIsAuthenticated(false);
            }
            finally {
                setLoading(false);
            }
        };
        checkAuth();
    }, []);
    return { isAuthenticated, loading };
};
