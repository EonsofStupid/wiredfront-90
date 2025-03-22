
import { useCallback } from 'react';
import { useChatLayoutStore } from '../store/chatLayoutStore';
import { useChatModeStore } from '../store/chatModeStore';
import { useNavigationModes } from './useNavigationModes';
import { ChatMode } from '@/types/chat/modes';
import { ChatPosition, ChatScale, ChatTheme, ChatUIPreferences } from '@/types/chat/ui';

/**
 * Main hook for chat functionality, providing a unified API for all chat-related features
 */
export const useChat = () => {
  // Layout
  const {
    isOpen,
    isMinimized,
    docked,
    position,
    scale,
    showSidebar,
    theme,
    uiPreferences,
    toggleOpen,
    toggleMinimize,
    toggleDocked,
    toggleSidebar,
    setPosition,
    setScale,
    setTheme,
    updatePreferences,
    resetLayout
  } = useChatLayoutStore();

  // Mode
  const {
    currentMode,
    previousMode,
    isTransitioning,
    transitionProgress,
    setMode: setModeInternal,
    switchMode,
    cancelTransition,
    resetMode
  } = useChatModeStore();

  // Navigation
  const {
    changeMode,
    syncPageWithMode,
    syncModeWithPage,
    getModeLabel,
    getModeDescription
  } = useNavigationModes();

  // Enhanced handlers
  const toggleChat = useCallback(() => {
    toggleOpen();
  }, [toggleOpen]);

  const setMode = useCallback((mode: ChatMode, navigate = false) => {
    changeMode(mode, navigate);
  }, [changeMode]);

  return {
    // Layout state
    isOpen,
    isMinimized,
    docked,
    position,
    scale,
    showSidebar,
    theme,
    uiPreferences,
    
    // Layout actions
    toggleOpen,
    toggleMinimize,
    toggleDocked,
    toggleSidebar,
    setPosition,
    setScale,
    setTheme,
    updatePreferences,
    resetLayout,
    toggleChat,
    
    // Mode state
    currentMode,
    previousMode,
    isTransitioning,
    transitionProgress,
    
    // Mode actions
    setMode,
    switchMode,
    cancelTransition,
    resetMode,
    
    // Navigation helpers
    syncPageWithMode,
    syncModeWithPage,
    getModeLabel,
    getModeDescription
  };
};

export default useChat;
