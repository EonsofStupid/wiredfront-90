
import { useState, useCallback, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { ChatMode } from '@/types/chat/enums';
import { ModeConfig, ModeContextType } from './types';
import { logger } from '@/services/chat/LoggingService';

// Define available modes with their configurations
const availableModes: ModeConfig[] = [
  {
    id: ChatMode.Chat,
    displayName: 'Chat',
    description: 'Standard chat conversation',
    icon: 'MessageSquare',
    defaultProvider: 'gpt-4'
  },
  {
    id: ChatMode.Dev,
    displayName: 'Developer',
    description: 'Code assistance and development help',
    icon: 'Code',
    requiredFeatures: ['codeAssistant'],
    defaultProvider: 'gpt-4'
  },
  {
    id: ChatMode.Image,
    displayName: 'Image',
    description: 'Generate and modify images',
    icon: 'ImageIcon',
    requiredFeatures: ['imageGeneration'],
    defaultProvider: 'dalle-3'
  },
  {
    id: ChatMode.Training,
    displayName: 'Training',
    description: 'Learn coding and concepts',
    icon: 'GraduationCap',
    requiredFeatures: ['training'],
    defaultProvider: 'gpt-4'
  }
];

/**
 * Hook to manage mode selection and switching
 */
export function useModeManager(): ModeContextType {
  const location = useLocation();
  const [currentMode, setCurrentMode] = useState<ChatMode>(ChatMode.Chat);
  const [isModeSwitchEnabled, setIsModeSwitchEnabled] = useState<boolean>(true);
  
  // Synchronize mode with current route
  useEffect(() => {
    const path = location.pathname;
    
    // Map routes to modes
    if (path.includes('/editor')) {
      handleModeChange(ChatMode.Dev);
    } else if (path.includes('/training')) {
      handleModeChange(ChatMode.Training);
    } else if (path.includes('/gallery')) {
      handleModeChange(ChatMode.Image);
    } else {
      // Default to Chat mode for other routes
      handleModeChange(ChatMode.Chat);
    }
  }, [location.pathname]);
  
  // Function to set the current mode
  const handleModeChange = useCallback((mode: ChatMode) => {
    logger.info('Mode changed', { prevMode: currentMode, newMode: mode });
    setCurrentMode(mode);
  }, [currentMode]);
  
  // Function to set the mode with validation and side effects
  const setMode = useCallback(async (mode: ChatMode): Promise<boolean> => {
    try {
      // Check if the mode is available
      const modeConfig = availableModes.find(m => m.id === mode);
      if (!modeConfig) {
        logger.warn('Attempting to switch to unavailable mode', { mode });
        return false;
      }
      
      // Set the mode
      handleModeChange(mode);
      
      // Log the mode change
      logger.info('Mode switched successfully', { mode });
      
      return true;
    } catch (error) {
      logger.error('Failed to set mode', { error, requestedMode: mode });
      return false;
    }
  }, [handleModeChange]);
  
  return {
    currentMode,
    setMode,
    availableModes,
    isModeSwitchEnabled
  };
}
