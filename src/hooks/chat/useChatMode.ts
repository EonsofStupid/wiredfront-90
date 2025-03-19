
import { useEffect } from 'react';
import { useCurrentMode, useModeActions } from '@/stores';
import { useNavigate, useLocation } from 'react-router-dom';
import { ChatMode } from '@/types/chat/modes';
import { logger } from '@/services/chat/LoggingService';

/**
 * Hook for accessing and managing chat mode with routing integration
 */
export function useChatMode() {
  const currentMode = useCurrentMode();
  const { setCurrentMode, isModeSupported, updateSessionMode } = useModeActions();
  const location = useLocation();
  const navigate = useNavigate();

  // Sync with URL/location state if available
  useEffect(() => {
    // Get mode from location state if available
    const locationMode = location.state?.mode;
    
    if (locationMode && isModeSupported(locationMode) && locationMode !== currentMode) {
      setCurrentMode(locationMode as ChatMode);
      logger.info('Mode set from location state', { mode: locationMode });
    }
  }, [location.state?.mode, currentMode, setCurrentMode, isModeSupported]);

  /**
   * Set mode and update navigation state
   */
  const setMode = (mode: ChatMode, providerId?: string) => {
    if (isModeSupported(mode)) {
      // Update the store
      setCurrentMode(mode, providerId);
      
      // Update the location state (for persistence across page navigation)
      navigate(location.pathname, { 
        state: { ...location.state, mode } 
      });
      
      logger.info('Mode updated', { mode, providerId });
      return true;
    } else {
      logger.warn('Attempted to set unsupported mode', { mode });
      return false;
    }
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

  return {
    currentMode,
    setMode,
    getModeLabel,
    isModeSupported,
    updateSessionMode
  };
}

export default useChatMode;
