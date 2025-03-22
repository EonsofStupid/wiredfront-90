import { useModeSwitch } from '@/components/chat/hooks/useModeSwitch';
import { useSyncModeWithNavigation } from '@/components/chat/hooks/useSyncModeWithNavigation';
import { useChatStore } from '@/stores/chat/chatStore';
import { Message } from '@/types/chat';
import { useCallback } from 'react';

/**
 * Main hook for interacting with the chat system
 * Provides access to all chat-related state and actions
 */
export const useChat = () => {
  // Access store
  const {
    messages,
    addMessage,
    updateMessage,
    removeMessage,
    sendMessage,
    fetchMessages,
    sessions,
    currentSession,
    setCurrentSession,
    createSession,
    updateSession,
    currentMode,
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
    setScale
  } = useChatStore();

  const { changeMode, getModeLabel, getModeDescription } = useModeSwitch();
  useSyncModeWithNavigation();

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
    setMode: changeMode,
    getModeLabel,
    getModeDescription
  };
};

export default useChat;
