
import { useCallback } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { ChatMode } from '@/integrations/supabase/types/enums';

interface NavigationMap {
  [key: string]: string;
}

/**
 * Hook to handle chat mode based navigation
 */
export const useNavigation = () => {
  const navigate = useNavigate();
  const location = useLocation();
  
  // Map modes to their respective routes
  const modeRoutes: NavigationMap = {
    'standard': '/', // Standard chat stays on current page
    'chat': '/', // Chat mode stays on current page
    'dev': '/editor', // Developer mode goes to editor
    'developer': '/editor',
    'training': '/training',
    'image': '/gallery',
  };
  
  /**
   * Navigate based on selected chat mode
   */
  const navigateByMode = useCallback((mode: ChatMode) => {
    // If mode is chat/standard, don't navigate away from current page
    if (mode === 'standard' || mode === 'chat') {
      return false;
    }
    
    const targetRoute = modeRoutes[mode];
    
    // Only navigate if we're not already on the target route
    if (targetRoute && location.pathname !== targetRoute) {
      navigate(targetRoute);
      return true;
    }
    
    return false;
  }, [navigate, location.pathname]);
  
  /**
   * Get current page type based on route
   */
  const getCurrentPageMode = useCallback((): ChatMode => {
    switch (location.pathname) {
      case '/editor':
        return 'dev';
      case '/training':
        return 'training';
      case '/gallery':
        return 'image';
      default:
        return 'chat';
    }
  }, [location.pathname]);
  
  return {
    navigateByMode,
    getCurrentPageMode,
    currentRoute: location.pathname
  };
};
