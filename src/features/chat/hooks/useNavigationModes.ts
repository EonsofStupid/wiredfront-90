
import { useNavigate, useLocation } from 'react-router-dom';
import { useChatModeStore } from '@/stores/features/chat/modeStore';
import { logger } from '@/services/chat/LoggingService';
import { ChatMode } from '@/types/chat';
import { toast } from 'sonner';

/**
 * Hook that handles mode switching with navigation
 * - Provides a unified interface for switching modes
 * - Handles navigation to the correct page based on mode
 * - Manages mode state persistence
 */
export function useNavigationModes() {
  const navigate = useNavigate();
  const location = useLocation();
  const { currentMode, setMode, switchMode } = useChatModeStore();
  
  /**
   * Map of modes to their corresponding routes
   */
  const MODE_ROUTES: Record<ChatMode, string | null> = {
    'chat': null, // Stay on current page
    'dev': '/editor',
    'image': '/gallery',
    'training': '/training',
    'code': '/editor',
    'planning': null, // Stay on current page
  };
  
  /**
   * Get a user-friendly label for the mode
   */
  const getModeLabel = (mode: ChatMode): string => {
    switch (mode) {
      case 'chat': return 'Chat';
      case 'dev': return 'Developer';
      case 'image': return 'Image Generation';
      case 'training': return 'Training';
      case 'planning': return 'Planning';
      case 'code': return 'Code Assistant';
      default: return mode;
    }
  };
  
  /**
   * Get a description for the mode
   */
  const getModeDescription = (mode: ChatMode): string => {
    switch (mode) {
      case 'chat': return 'General assistance and conversation';
      case 'dev': return 'Development and programming help';
      case 'image': return 'Generate and edit images';
      case 'training': return 'Educational content and tutorials';
      case 'code': return 'Code-specific assistance and reviews';
      case 'planning': return 'Project planning and architecture';
      default: return 'AI assistance';
    }
  };
  
  /**
   * Change mode with navigation
   */
  const changeMode = async (newMode: ChatMode): Promise<boolean> => {
    try {
      // Set the mode in the store
      setMode(newMode);
      
      // Get the target route for this mode
      const targetRoute = MODE_ROUTES[newMode];
      
      // Only navigate if we have a target and we're not already there
      if (targetRoute && location.pathname !== targetRoute) {
        logger.info(`Navigating to ${targetRoute} for ${newMode} mode`);
        navigate(targetRoute, { state: { mode: newMode } });
      } else {
        // Just update the location state without navigation
        navigate(location.pathname, { 
          state: { ...location.state, mode: newMode },
          replace: true 
        });
      }
      
      // Show success toast
      toast.success(`Switched to ${getModeLabel(newMode)} mode`, {
        description: getModeDescription(newMode),
      });
      
      return true;
    } catch (error) {
      logger.error('Error changing mode', error);
      toast.error(`Failed to switch mode: ${error instanceof Error ? error.message : 'Unknown error'}`);
      return false;
    }
  };
  
  /**
   * Check if current page matches the expected page for the mode
   */
  const isPageMatchingMode = (): boolean => {
    const expectedRoute = MODE_ROUTES[currentMode];
    
    if (!expectedRoute) return true; // Modes without specific routes always match
    
    return location.pathname === expectedRoute;
  };
  
  /**
   * If needed, navigate to the correct page for the current mode
   */
  const syncPageWithMode = () => {
    const targetRoute = MODE_ROUTES[currentMode];
    
    if (targetRoute && location.pathname !== targetRoute) {
      logger.info(`Syncing page with ${currentMode} mode: navigating to ${targetRoute}`);
      navigate(targetRoute, { state: { mode: currentMode } });
      return true;
    }
    
    return false;
  };
  
  return {
    currentMode,
    changeMode,
    getModeLabel,
    getModeDescription,
    isPageMatchingMode,
    syncPageWithMode
  };
}
