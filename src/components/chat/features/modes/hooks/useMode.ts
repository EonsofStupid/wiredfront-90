
import { useCallback } from 'react';
import { useChatStore } from '@/components/chat/store/chatStore';
import { useChatBridge } from '@/components/chat/chatBridge';
import { ChatMode, databaseModeToUiMode, uiModeToDatabaseMode } from '@/types/chat/enums';
import { ModeConfig } from '../types/mode-types';
import { EnumUtils } from '@/lib/enums';

// Define available modes with their configurations
const availableModes: ModeConfig[] = [
  {
    id: ChatMode.Chat,
    displayName: 'Chat',
    description: 'Standard chat conversation',
    icon: 'MessageSquare',
    defaultProvider: 'gpt-4',
  },
  {
    id: ChatMode.Dev,
    displayName: 'Developer',
    description: 'Code assistance and development help',
    icon: 'Code',
    requiredFeatures: ['codeAssistant'],
    defaultProvider: 'gpt-4',
  },
  {
    id: ChatMode.Image,
    displayName: 'Image',
    description: 'Generate and modify images',
    icon: 'ImageIcon',
    requiredFeatures: ['imageGeneration'],
    defaultProvider: 'dalle-3',
  },
  {
    id: ChatMode.Training,
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
  const currentMode = typeof storeMode === 'string' 
    ? EnumUtils.stringToChatMode(storeMode) 
    : storeMode as ChatMode;
    
  const uiMode = currentMode in databaseModeToUiMode ? 
    databaseModeToUiMode[currentMode] : 
    EnumUtils.chatModeToString(currentMode);

  // Function to change the mode
  const setMode = useCallback((mode: string) => {
    // Map UI mode to database mode if needed
    const dbMode = mode in uiModeToDatabaseMode ? 
      uiModeToDatabaseMode[mode] : 
      EnumUtils.stringToChatMode(mode);
      
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
