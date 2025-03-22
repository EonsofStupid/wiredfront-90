
import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { useNavigationModes } from './useNavigationModes';

/**
 * Hook that synchronizes the chat mode with the current route
 * and vice versa
 */
export const useSyncModeWithNavigation = () => {
  const location = useLocation();
  const { syncModeWithPage } = useNavigationModes();

  // Sync mode when the route changes
  useEffect(() => {
    syncModeWithPage();
  }, [location.pathname, syncModeWithPage]);

  return null;
};
