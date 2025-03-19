
import { useEffect } from 'react';
import { useChatModeStore } from '@/components/chat/store/chatModeStore';
import { useNavigate, useLocation } from 'react-router-dom';
import { ChatMode } from '@/types/chat';
import { logger } from '@/services/chat/LoggingService';

/**
 * Hook for accessing and managing chat mode with routing integration
 */
export function useChatMode() {
  const { currentMode, setCurrentMode, isModeSupported } = useChatModeStore();
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

  return {
    currentMode,
    setMode,
    isModeSupported
  };
}
