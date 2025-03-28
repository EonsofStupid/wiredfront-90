
import { useCallback } from 'react';
import { useChatBridge } from '../ChatBridge';
import { useChatStore } from '@/components/chat/store/chatStore';
import { ChatMode } from '@/types/chat/enums';
import { ModeConfig } from './types';

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
export const useModeManager = () => {
  const { currentMode: storeMode, features } = useChatStore();
  const chatBridge = useChatBridge();
  
  // Use the actual chat mode from store
  const currentMode = (typeof storeMode === 'string' 
    ? storeMode as ChatMode 
    : storeMode) || ChatMode.Chat;

  // Function to change the mode
  const setMode = useCallback((mode: ChatMode) => {
    return chatBridge.setMode(mode);
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

  // Check if mode switching is enabled
  const isModeSwitchEnabled = !!features.modeSwitch;

  return {
    currentMode,
    setMode,
    availableModes: filteredModes,
    isModeSwitchEnabled
  };
};
