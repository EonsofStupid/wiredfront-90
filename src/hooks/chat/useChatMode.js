import { useEffect } from 'react';
import { useCurrentMode, useModeActions } from '@/stores';
import { useNavigate, useLocation } from 'react-router-dom';
import { logger } from '@/services/chat/LoggingService';
/**
 * Hook for accessing and managing chat mode with routing integration
 */
export function useChatMode() {
    const currentMode = useCurrentMode();
    const { setMode, switchMode, cancelTransition, resetMode } = useModeActions();
    const location = useLocation();
    const navigate = useNavigate();
    // Sync with URL/location state if available
    useEffect(() => {
        // Get mode from location state if available
        const locationMode = location.state?.mode;
        if (locationMode && currentMode !== locationMode) {
            setMode(locationMode);
            logger.info('Mode set from location state', { mode: locationMode });
        }
    }, [location.state?.mode, currentMode, setMode]);
    /**
     * Set mode and update navigation state
     */
    const setModeWithRouting = (mode) => {
        setMode(mode);
        // Update the location state (for persistence across page navigation)
        navigate(location.pathname, {
            state: { ...location.state, mode }
        });
        logger.info('Mode updated with routing', { mode });
        return true;
    };
    /**
     * Get a user-friendly label for the mode
     */
    const getModeLabel = (mode) => {
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
        setMode: setModeWithRouting,
        switchMode,
        cancelTransition,
        resetMode,
        getModeLabel
    };
}
export default useChatMode;
