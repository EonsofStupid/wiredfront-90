
import { useContext } from 'react';
import { ModeConfig } from '@/modules/ModeManager/types';
import { ChatMode } from '@/types/chat/enums';
import { useChatBridge } from '@/modules/ChatBridge';

export interface UseModeResult {
  currentMode: ChatMode;
  availableModes: ModeConfig[];
  setMode: (mode: ChatMode) => Promise<boolean>;
}

/**
 * Hook to access and manage chat modes
 */
export function useMode(): UseModeResult {
  const chatBridge = useChatBridge();
  
  // Get current mode from bridge
  const currentMode = chatBridge.getCurrentMode();
  
  // Available modes (could be fetched from the bridge in the future)
  const availableModes: ModeConfig[] = [
    {
      id: ChatMode.Chat,
      name: 'Chat',
      description: 'Standard conversation',
      icon: 'MessageSquare',
    },
    {
      id: ChatMode.Dev,
      name: 'Developer',
      description: 'Code assistance',
      icon: 'Code',
      requiredFeatures: ['codeAssistant']
    },
    {
      id: ChatMode.Image,
      name: 'Image',
      description: 'Create images',
      icon: 'Image',
      requiredFeatures: ['imageGeneration']
    },
    {
      id: ChatMode.Training,
      name: 'Training',
      description: 'Learning assistant',
      icon: 'GraduationCap',
      requiredFeatures: ['training']
    }
  ];
  
  // Function to set the mode via the bridge
  const setMode = async (mode: ChatMode): Promise<boolean> => {
    return chatBridge.setMode(mode);
  };
  
  return {
    currentMode,
    availableModes,
    setMode
  };
}
