
import { useChatStore } from '@/components/chat/store';
import { ChatMode } from '@/integrations/supabase/types/enums';
import { ChatPosition } from '@/components/chat/store/types/chat-store-types';

/**
 * Hook for accessing and controlling the chat UI state
 */
export function useChatUI() {
  const {
    isOpen,
    toggleChat,
    isMinimized,
    toggleMinimize,
    showSidebar,
    toggleSidebar,
    toggleUIState,
    position,
    scale,
    setScale,
    docked,
    currentMode,
    setCurrentMode,
    ui: { sessionLoading, messageLoading, providerLoading },
    setSessionLoading,
    setMessageLoading,
    setProviderLoading
  } = useChatStore();

  return {
    // Basic UI state
    isOpen,
    toggleChat,
    isMinimized,
    toggleMinimize,
    showSidebar,
    toggleSidebar,
    
    // Position controls
    position,
    docked,
    
    // UI customization
    scale,
    setScale,
    
    // Mode controls
    currentMode,
    setMode: (mode: ChatMode) => setCurrentMode(mode),
    
    // Loading states
    isSessionLoading: sessionLoading,
    isMessageLoading: messageLoading,
    isProviderLoading: providerLoading,
    setSessionLoading,
    setMessageLoading,
    setProviderLoading,
    
    // Generic state control
    toggleUIState
  };
}
