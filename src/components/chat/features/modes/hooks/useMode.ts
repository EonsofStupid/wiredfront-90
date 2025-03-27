
import { useCallback } from 'react';
import { useChatStore } from '@/components/chat/store/chatStore';
import { useChatBridge } from '@/components/chat/chatBridge';
import { ChatMode, databaseModeToUiMode, uiModeToDatabaseMode } from '@/types/chat/enums';
import { ModeConfig } from '../types/mode-types';

// Define available modes with their configurations
const availableModes: ModeConfig[] = [
  {
    id: 'chat',
    displayName: 'Chat',
    description: 'Standard chat conversation',
    icon: 'MessageSquare',
    defaultProvider: 'gpt-4',
  },
  {
    id: 'dev',
    displayName: 'Developer',
    description: 'Code assistance and development help',
    icon: 'Code',
    requiredFeatures: ['codeAssistant'],
    defaultProvider: 'gpt-4',
  },
  {
    id: 'image',
    displayName: 'Image',
    description: 'Generate and modify images',
    icon: 'ImageIcon',
    requiredFeatures: ['imageGeneration'],
    defaultProvider: 'dalle-3',
  },
  {
    id: 'training',
    displayName: 'Training',
    description: 'Learn coding and concepts',
    icon: 'GraduationCap',
    requiredFeatures: ['training'],
    defaultProvider: 'gpt-4',
  },
];

/**
 * Hook to manage chat modes
 */
export const useMode = () => {
  const { currentMode: storeMode, features } = useChatStore();
  const chatBridge = useChatBridge();
  
  // Convert from database mode to UI mode for consistency
  const currentMode = storeMode as ChatMode;
  const uiMode = currentMode in databaseModeToUiMode ? 
    databaseModeToUiMode[currentMode] : 
    currentMode;

  // Function to change the mode
  const setMode = useCallback((mode: string) => {
    // Map UI mode to database mode if needed
    const dbMode = mode in uiModeToDatabaseMode ? 
      uiModeToDatabaseMode[mode] : 
      mode;
      
    chatBridge.setMode(dbMode);
  }, [chatBridge]);

  // Filter modes based on available features
  const filteredModes = availableModes.filter(mode => {
    if (!mode.requiredFeatures || mode.requiredFeatures.length === 0) {
      return true;
    }
    
    return mode.requiredFeatures.every(feature => 
      features[feature as keyof typeof features]
    );
  });

  return {
    currentMode: uiMode,
    setMode,
    availableModes: filteredModes,
  };
};
