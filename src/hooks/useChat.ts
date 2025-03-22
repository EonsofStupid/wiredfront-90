import { useChatStore } from '@/stores/chat/chatStore';
import { Message } from '@/types/chat';
import { useCallback } from 'react';

/**
 * Main hook for interacting with the chat system
 * Provides access to all chat-related state and actions
 */
export const useChat = () => {
  // Access store
  const store = useChatStore();

  // Create a message
  const handleSendMessage = useCallback(async (content: string) => {
    store.addMessage({
      id: crypto.randomUUID(),
      content,
      role: 'user',
      timestamp: new Date().toISOString()
    });
  }, [store]);

  // Update a message
  const handleUpdateMessage = useCallback((messageId: string, updates: Partial<Message>) => {
    store.updateMessage(messageId, updates);
  }, [store]);

  // Delete a message
  const handleDeleteMessage = useCallback((messageId: string) => {
    store.updateMessage(messageId, { status: 'deleted' });
  }, [store]);

  return {
    // Layout state
    isOpen: store.isOpen,
    isMinimized: store.isMinimized,
    docked: store.docked,
    position: store.position,
    scale: store.scale,
    showSidebar: store.showSidebar,

    // Layout actions
    toggleOpen: () => store.setFeatureState('startMinimized', !store.isOpen),
    toggleMinimize: () => store.setFeatureState('startMinimized', !store.isMinimized),
    toggleDocked: store.toggleDocked,
    toggleSidebar: () => store.setFeatureState('modeSwitch', !store.showSidebar),
    setPosition: (pos: { x: number; y: number }) => store.setFeatureState('startMinimized', false),
    setScale: store.setScale,

    // Message state
    messages: store.messages,

    // Message actions
    sendMessage: handleSendMessage,
    updateMessage: handleUpdateMessage,
    deleteMessage: handleDeleteMessage,

    // Mode state and actions
    currentMode: store.currentMode,
    setMode: store.setCurrentMode
  };
};

export default useChat;
