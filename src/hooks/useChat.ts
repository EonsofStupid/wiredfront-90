
import { useCallback } from 'react';
import { useChatStore } from '@/stores/chat/chatStore';
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
  themeAtom,
  chatPreferencesAtom
} from '@/stores/ui/chat/atoms';
import { Message } from '@/types/chat';

/**
 * Main hook for interacting with the chat system
 * Combines Zustand store for application state and Jotai atoms for UI state
 */
export const useChat = () => {
  // Zustand state for data
  const {
    // Message state and actions
    messages,
    addMessage,
    updateMessage,
    removeMessage,
    clearMessages,
    sendMessage,
    
    // Session state and actions
    sessions,
    currentSession,
    setCurrentSession,
    createSession,
    updateSession,
    deleteSession,
    
    // Mode state and actions
    currentMode,
    setCurrentMode,
    getModeLabel,
    getModeDescription
  } = useChatStore();
  
  // Jotai atoms for UI state
  const [isOpen, setIsOpen] = useAtom(isOpenAtom);
  const [isMinimized, setIsMinimized] = useAtom(isMinimizedAtom);
  const [docked, setDocked] = useAtom(isDockedAtom);
  const [position, setPosition] = useAtom(positionAtom);
  const [scale, setScale] = useAtom(scaleAtom);
  const [showSidebar, setShowSidebar] = useAtom(showSidebarAtom);
  const [theme, setTheme] = useAtom(themeAtom);
  const [uiPreferences] = useAtom(chatPreferencesAtom);
  
  // Jotai actions
  const [, toggleOpen] = useAtom(toggleOpenAtom);
  const [, toggleMinimize] = useAtom(toggleMinimizedAtom);
  const [, toggleDocked] = useAtom(toggleDockedAtom);
  const [, toggleSidebar] = useAtom(toggleSidebarAtom);
  
  // Enhanced actions that combine multiple systems
  
  // Send a message, creating a session if needed
  const handleSendMessage = useCallback(async (content: string) => {
    if (!currentSession) {
      const session = await createSession();
      setCurrentSession(session);
      return sendMessage(content, session.id);
    }
    return sendMessage(content, currentSession.id);
  }, [currentSession, createSession, setCurrentSession, sendMessage]);
  
  // Update a message
  const handleUpdateMessage = useCallback((messageId: string, updates: Partial<Message>) => {
    updateMessage(messageId, updates);
  }, [updateMessage]);
  
  // Delete a message
  const handleDeleteMessage = useCallback((messageId: string) => {
    removeMessage(messageId);
  }, [removeMessage]);
  
  // Create a session
  const handleCreateSession = useCallback(async (options = {}) => {
    const session = await createSession(options);
    return session;
  }, [createSession]);
  
  // Toggle chat open state
  const toggleChat = useCallback(() => {
    toggleOpen();
  }, [toggleOpen]);
  
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
    toggleChat,
    
    // Message state
    messages,
    
    // Message actions
    sendMessage: handleSendMessage,
    updateMessage: handleUpdateMessage,
    deleteMessage: handleDeleteMessage,
    clearMessages,
    
    // Session state
    sessions,
    currentSession,
    
    // Session actions
    createSession: handleCreateSession,
    setCurrentSession,
    updateSession,
    
    // Mode state and actions
    currentMode,
    setMode: setCurrentMode,
    getModeLabel,
    getModeDescription
  };
};

export default useChat;
