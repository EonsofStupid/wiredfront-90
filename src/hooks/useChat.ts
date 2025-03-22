
import { useCallback } from 'react';
import { useAtom } from 'jotai';
import { 
  isOpenAtom, 
  isMinimizedAtom, 
  isDockedAtom,
  positionAtom,
  scaleAtom,
  showSidebarAtom,
  toggleOpenAtom,
  toggleMinimizedAtom,
  toggleDockedAtom,
  toggleSidebarAtom,
  themeAtom
} from '@/stores/ui/chat/atoms';
import { useChatStore } from '@/stores/chat/chatStore';
import { ChatPosition, ChatTheme, Message } from '@/types/chat';

/**
 * Primary hook for accessing all chat functionality
 * Combines UI state (Jotai) with application state (Zustand)
 */
export const useChat = () => {
  // UI state from Jotai
  const [isOpen, setIsOpen] = useAtom(isOpenAtom);
  const [isMinimized, setIsMinimized] = useAtom(isMinimizedAtom);
  const [docked, setDocked] = useAtom(isDockedAtom);
  const [position, setPosition] = useAtom(positionAtom);
  const [scale, setScale] = useAtom(scaleAtom);
  const [showSidebar, setShowSidebar] = useAtom(showSidebarAtom);
  const [theme, setTheme] = useAtom(themeAtom);
  
  // Chat functionality from Zustand
  const {
    // Messages
    messages,
    addMessage,
    updateMessage,
    removeMessage,
    clearMessages,
    sendMessage: storeSendMessage,
    
    // Sessions
    sessions,
    currentSession,
    setCurrentSession,
    createSession,
    
    // Mode
    currentMode,
    setCurrentMode,
    getModeLabel,
    getModeDescription
  } = useChatStore();
  
  // UI actions from Jotai
  const [, toggleOpen] = useAtom(toggleOpenAtom);
  const [, toggleMinimize] = useAtom(toggleMinimizedAtom);
  const [, toggleDocked] = useAtom(toggleDockedAtom);
  const [, toggleSidebar] = useAtom(toggleSidebarAtom);
  
  // Enhanced combined actions
  
  /**
   * Send a message, creating a session if needed
   */
  const sendMessage = useCallback(async (content: string) => {
    if (!currentSession) {
      const session = await createSession();
      setCurrentSession(session);
      return storeSendMessage(content, session.id);
    }
    return storeSendMessage(content, currentSession.id);
  }, [currentSession, createSession, setCurrentSession, storeSendMessage]);
  
  /**
   * Update an existing message
   */
  const handleUpdateMessage = useCallback((messageId: string, updates: Partial<Message>) => {
    updateMessage(messageId, updates);
  }, [updateMessage]);
  
  /**
   * Delete a message
   */
  const handleDeleteMessage = useCallback((messageId: string) => {
    removeMessage(messageId);
  }, [removeMessage]);
  
  return {
    // Layout state
    isOpen,
    isMinimized,
    docked,
    position,
    scale,
    showSidebar,
    theme,
    
    // Layout actions
    toggleOpen,
    toggleMinimize,
    toggleDocked,
    toggleSidebar,
    setIsOpen,
    setIsMinimized,
    setDocked,
    setPosition,
    setScale,
    setShowSidebar,
    setTheme,
    
    // Messages state & actions
    messages,
    sendMessage,
    updateMessage: handleUpdateMessage,
    deleteMessage: handleDeleteMessage,
    clearMessages,
    
    // Session state & actions
    sessions,
    currentSession,
    setCurrentSession,
    createSession,
    
    // Mode state & actions
    currentMode,
    setMode: setCurrentMode,
    getModeLabel,
    getModeDescription
  };
};

export default useChat;
