
import { useCallback } from 'react';
import { useChatStore } from '@/stores/chat/chatStore';
import { Message } from '@/types/chat';

/**
 * Main hook for interacting with the chat system
 * Provides access to all chat-related state and actions
 */
export const useChat = () => {
  const {
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
    
    // Messages state
    messages,
    
    // Messages actions
    addMessage,
    updateMessage,
    removeMessage,
    sendMessage,
    clearMessages,
    
    // Session state
    sessions,
    currentSession,
    
    // Session actions
    setCurrentSession,
    createSession,
    updateSession,
    
    // Mode state
    currentMode,
    
    // Mode actions
    setCurrentMode,
    getModeLabel,
    getModeDescription,
    
    // Preferences actions
    updatePreferences
  } = useChatStore();

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
  const handleCreateSession = useCallback(async () => {
    const session = await createSession();
    setCurrentSession(session);
    return session;
  }, [createSession, setCurrentSession]);

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
    getModeDescription,
    
    // Preferences actions
    updatePreferences
  };
};

export default useChat;
