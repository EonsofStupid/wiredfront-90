/**
 * Chat feature store exports
 */

// Export chat mode management
export * from './modeStore';

// Export chat message management
export * from './messageStore';

// Export chat session management
export * from './sessionStore';

// Export chat layout management
export * from './layoutStore';

// Export combined hooks
import { useChatStore } from '@/stores/chat/chatStore';
import { useChatModeStore } from './modeStore';
import { useChatSessionStore } from './sessionStore';

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

// Export hooks
export { useChatModeStore, useChatSessionStore };

export const useChatFeatures = () => {
  const features = useChatStore(state => state.features);
  const toggleFeature = useChatStore(state => state.toggleFeature);
  const enableFeature = useChatStore(state => state.enableFeature);
  const disableFeature = useChatStore(state => state.disableFeature);
  const setFeatureState = useChatStore(state => state.setFeatureState);

  return {
    features,
    toggleFeature,
    enableFeature,
    disableFeature,
    setFeatureState
  };
};
