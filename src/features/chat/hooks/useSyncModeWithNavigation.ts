import { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useChatModeStore } from '@/stores/features/chat/modeStore';
import { logger } from '@/services/chat/LoggingService';
import { ChatMode } from '@/types/chat';
import { toast } from 'sonner';

/**
 * Hook to synchronize chat mode with current route
 * - On initial load, sets mode based on current route
 * - If navigating with state.mode, updates the chat mode accordingly
 * - If current mode requires a specific page, ensures we're on that page
 */
export function useSyncModeWithNavigation() {
  const location = useLocation();
  const navigate = useNavigate();
  const { currentMode, setMode } = useChatModeStore();
  
  // Map routes to modes - this is the single source of truth for route-mode mapping
  const ROUTE_MODES: Record<string, ChatMode> = {
    '/editor': 'dev',
    '/gallery': 'image',
    '/training': 'training'
  };
  
  // Map modes to their required routes (if any)
  const MODE_ROUTES: Record<ChatMode, string | null> = {
    'chat': null, // Chat mode can be used on any page
    'dev': '/editor',
    'image': '/gallery',
    'training': '/training',
    'code': '/editor',
    'planning': null // Planning mode can be used on any page
  };
  
  // Map modes to user-friendly labels
  const MODE_LABELS: Record<ChatMode, string> = {
    'chat': 'Chat',
    'dev': 'Developer',
    'image': 'Image Generation',
    'training': 'Training',
    'code': 'Code Assistant',
    'planning': 'Planning'
  };
  
  // On initial load & route changes
  useEffect(() => {
    // Check if we have a mode in location state
    if (location.state?.mode) {
      const modeFromState = location.state.mode as ChatMode;
      logger.info('Setting mode from location state', { mode: modeFromState });
      setMode(modeFromState);
    } 
    // Otherwise, try to set mode based on current route
    else {
      const path = location.pathname;
      if (ROUTE_MODES[path]) {
        const mode = ROUTE_MODES[path];
        logger.info('Setting mode based on route', { route: path, mode });
        setMode(mode);
      }
    }
  }, [location.pathname, location.state, setMode]);
  
  // Ensure we're on the right page for the current mode
  useEffect(() => {
    // Get the required route for this mode
    const requiredRoute = MODE_ROUTES[currentMode];
    
    // If this mode requires a specific route and we're not on it
    if (requiredRoute && location.pathname !== requiredRoute) {
      logger.info(`Mode ${currentMode} requires route ${requiredRoute}, navigating...`);
      navigate(requiredRoute, { state: { mode: currentMode } });
      toast.info(`Switched to ${MODE_LABELS[currentMode]} mode`);
    }
  }, [currentMode, location.pathname, navigate]);
  
  // Public API to manually sync page with mode
  const syncPageWithMode = () => {
    const requiredRoute = MODE_ROUTES[currentMode];
    
    if (requiredRoute && location.pathname !== requiredRoute) {
      logger.info(`Syncing page with ${currentMode} mode: navigating to ${requiredRoute}`);
      navigate(requiredRoute, { state: { mode: currentMode } });
      return true;
    }
    
    return false;
  };
  
  return { syncPageWithMode };
}
