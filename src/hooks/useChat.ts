
import { useChatLayoutStore } from '@/stores/chat/chatLayoutStore';
import { useChatModeStore } from '@/stores/features/chat/modeStore';
import { useChatMessageStore } from '@/stores/features/chat/messageStore';
import { useChatSessionStore } from '@/stores/features/chat/sessionStore';
import { Message, Session } from '@/types/chat';
import { useCallback } from 'react';

/**
 * Main hook for interacting with the chat system
 * Provides access to all chat-related state and actions
 */
export const useChat = () => {
  // Access stores
  const layout = useChatLayoutStore();
  const { messages, addMessage, updateMessage, removeMessage, sendMessage, fetchMessages } = useChatMessageStore();
  const { sessions, currentSession, setCurrentSession, createSession, updateSession } = useChatSessionStore();
  const { currentMode, setMode } = useChatModeStore();

  // Create a message
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
    layout.toggleOpen();
  }, [layout]);

  return {
    // Layout state
    isOpen: layout.isOpen,
    isMinimized: layout.isMinimized,
    docked: layout.docked,
    position: layout.position,
    scale: layout.scale,
    showSidebar: layout.showSidebar,
    theme: layout.theme,
    uiPreferences: layout.uiPreferences,
    
    // Layout actions
    toggleOpen: layout.toggleOpen,
    toggleMinimize: layout.toggleMinimize,
    toggleDocked: layout.toggleDocked,
    toggleSidebar: layout.toggleSidebar,
    setPosition: layout.setPosition,
    setScale: layout.setScale,
    toggleChat,
    
    // Message state
    messages,
    
    // Message actions
    sendMessage: handleSendMessage,
    updateMessage: handleUpdateMessage,
    deleteMessage: handleDeleteMessage,
    fetchMessages,
    
    // Session state
    sessions,
    currentSession,
    
    // Session actions
    createSession: handleCreateSession,
    setCurrentSession,
    updateSession,
    
    // Mode state and actions
    currentMode,
    setMode
  };
};

export default useChat;
