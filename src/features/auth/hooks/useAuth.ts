import { useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store';
import type { LoginCredentials } from '../types';

export const useAuth = () => {
  const navigate = useNavigate();
  const {
    user,
    isAuthenticated,
    loading,
    login,
    logout,
    refreshToken
  } = useAuthStore();

  const handleLogin = useCallback(async (credentials: LoginCredentials) => {
    try {
      const result = await login(credentials);
      if (result.success) {
        // Get the stored path or default to dashboard
        const redirectTo = sessionStorage.getItem('lastVisitedPath') || '/dashboard';
        sessionStorage.removeItem('lastVisitedPath');
        navigate(redirectTo);
      }
      return result;
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Login failed'
      };
    }
  }, [login, navigate]);

  const handleLogout = useCallback(async () => {
    await logout();
    navigate('/login');
  }, [logout, navigate]);

  const handleTokenRefresh = useCallback(async () => {
    try {
      await refreshToken();
      return true;
    } catch {
      navigate('/login');
      return false;
    }
  }, [refreshToken, navigate]);

  return {
    user,
    isAuthenticated,
    loading,
    login: handleLogin,
    logout: handleLogout,
    refreshToken: handleTokenRefresh
  };
};
