
import { useContext } from 'react';
import { ModeConfig } from '@/modules/ModeManager/types';
import { ChatMode } from '@/components/chat/types/chat/enums';
import { useChatBridge } from '@/modules/ChatBridge';
import { DEFAULT_CHAT_MODES } from '@/components/chat/types/chat-modes';

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
  const availableModes: ModeConfig[] = DEFAULT_CHAT_MODES.map(mode => ({
    id: mode.id,
    name: mode.name,
    description: mode.description,
    icon: mode.icon,
    requiredFeatures: mode.requiredFeatures
  }));
  
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
