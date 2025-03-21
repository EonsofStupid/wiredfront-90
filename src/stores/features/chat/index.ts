
/**
 * Chat feature store exports
 */

// Export role management
export * from './roleStore';

// Export chat mode management
export * from './modeStore';

// Export chat message management
export * from './messageStore';

// Export chat session management
export * from './sessionStore';

// Export combined hooks
import { useChatModeStore } from './modeStore';
import { useChatMessageStore } from './messageStore';
import { useChatSessionStore } from './sessionStore';
import { useChatLayoutStore } from '@/stores/chat/chatLayoutStore';

/**
 * Combined access to all chat stores
 */
export const useChatCombined = () => {
  const mode = useChatModeStore();
  const messages = useChatMessageStore();
  const session = useChatSessionStore();
  const layout = useChatLayoutStore();
  
  return {
    // Mode
    currentMode: mode.currentMode,
    previousMode: mode.previousMode,
    setMode: mode.setMode,
    switchMode: mode.switchMode,
    
    // Messages
    messages: messages.messages,
    isLoading: messages.isLoading,
    messageError: messages.error,
    sendMessage: messages.sendMessage,
    addMessage: messages.addMessage,
    updateMessage: messages.updateMessage,
    removeMessage: messages.removeMessage,
    clearMessages: messages.clearMessages,
    
    // Session
    currentSession: session.currentSession,
    sessions: session.sessions,
    createSession: session.createSession,
    updateSession: session.updateSession,
    deleteSession: session.deleteSession,
    
    // Layout
    isOpen: layout.isOpen,
    isMinimized: layout.isMinimized,
    docked: layout.docked,
    position: layout.position,
    scale: layout.scale,
    showSidebar: layout.showSidebar,
    toggleOpen: layout.toggleOpen,
    toggleMinimize: layout.toggleMinimize,
    toggleDocked: layout.toggleDocked,
    toggleSidebar: layout.toggleSidebar,
    setPosition: layout.setPosition
  };
};

// Export types
export * from './types';
