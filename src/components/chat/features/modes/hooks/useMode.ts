
import { useContext } from 'react';
import { ModeConfig, CHAT_MODES } from '@/modules/ModeManager/types';
import { ChatMode } from '@/components/chat/types/chat/enums';
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
  
  // Available modes (use CHAT_MODES from the ModeManager)
  const availableModes: ModeConfig[] = CHAT_MODES;
  
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
