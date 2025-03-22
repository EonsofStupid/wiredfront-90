import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { useChatModeStore } from '@/stores/features/chat/modeStore';
import { logger } from '@/services/chat/LoggingService';
import { useNavigationModes } from './useNavigationModes';

/**
 * Hook to synchronize chat mode with current route
 * - On initial load, sets mode based on current route
 * - If navigating with state.mode, updates the chat mode accordingly
 * - If current mode requires a specific page, ensures we're on that page
 */
export function useSyncModeWithNavigation() {
  const location = useLocation();
  const { setMode } = useChatModeStore();
  const { syncPageWithMode } = useNavigationModes();
  
  // Map routes to modes
  const ROUTE_MODES = {
    '/editor': 'dev',
    '/gallery': 'image',
    '/training': 'training'
  } as const;
  
  // On initial load & route changes
  useEffect(() => {
    // Check if we have a mode in location state
    if (location.state?.mode) {
      const modeFromState = location.state.mode;
      logger.info('Setting mode from location state', { mode: modeFromState });
      setMode(modeFromState);
    } 
    // Otherwise, try to set mode based on current route
    else {
      const path = location.pathname;
      // @ts-ignore - Type safety handled by conditional
      if (Object.keys(ROUTE_MODES).includes(path)) {
        // @ts-ignore - We already checked that the key exists
        const mode = ROUTE_MODES[path];
        logger.info('Setting mode based on route', { route: path, mode });
        setMode(mode);
      }
    }
  }, [location.pathname, location.state, setMode]);
  
  // Ensure we're on the right page for the current mode
  useEffect(() => {
    syncPageWithMode();
    // We want this to run only on mount
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  
  return null; // This hook doesn't return anything
}
