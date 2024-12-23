import { User } from '@supabase/supabase-js';

export const getRedirectPath = (user: User | null) => {
  // Get stored path or default to dashboard
  const storedPath = sessionStorage.getItem('lastVisitedPath');
  
  if (!user) return '/login';
  
  // Check user role for custom landing page
  const userRole = user.app_metadata.role;
  if (userRole === 'admin') return '/admin/dashboard';
  
  // Return stored path or default dashboard
  return storedPath || '/dashboard';
};

export const storeLastVisitedPath = (path: string) => {
  // Don't store login or auth-related paths
  if (path === '/login' || path.startsWith('/auth')) return;
  sessionStorage.setItem('lastVisitedPath', path);
};

export const getLoginRedirectUrl = () => {
  const currentPath = window.location.pathname;
  if (currentPath === '/login') {
    const returnTo = new URLSearchParams(window.location.search).get('returnTo');
    return returnTo || '/dashboard';
  }
  return currentPath;
};