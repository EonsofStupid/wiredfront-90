
import { useChatStore } from './store/chatStore';
import { useMessageStore } from './messaging/MessageManager';
import { ChatMode, ChatPosition } from '@/types/chat/enums';
import { logger } from '@/services/chat/LoggingService';

/**
 * ChatBridge serves as the primary interface between the chat client
 * and the rest of the application. All communication should go through this bridge.
 */
export class ChatBridge {
  // State Access Methods
  static getChatState() {
    return useChatStore.getState();
  }

  static getMessages() {
    return useMessageStore.getState().messages;
  }

  // Chat Control Methods
  static openChat() {
    const { isOpen, toggleChat } = useChatStore.getState();
    if (!isOpen) {
      toggleChat();
      logger.info('Chat opened via ChatBridge');
    }
  }

  static closeChat() {
    const { isOpen, toggleChat } = useChatStore.getState();
    if (isOpen) {
      toggleChat();
      logger.info('Chat closed via ChatBridge');
    }
  }

  static toggleChat() {
    const { toggleChat } = useChatStore.getState();
    toggleChat();
    logger.info('Chat toggled via ChatBridge');
  }

  // Message Methods
  static async sendMessage(message: string) {
    const { setUserInput } = useChatStore.getState();
    setUserInput(message);
    
    // Simulate a click on the send button
    const sendButton = document.querySelector('[data-testid="send-button"]') as HTMLButtonElement;
    if (sendButton) {
      sendButton.click();
      logger.info('Message sent via ChatBridge');
      return true;
    }
    
    logger.error('Failed to send message via ChatBridge - send button not found');
    return false;
  }

  static clearMessages() {
    const { clearMessages } = useMessageStore.getState();
    clearMessages();
    logger.info('Messages cleared via ChatBridge');
  }

  // Mode Management
  static setMode(mode: ChatMode) {
    const { setMode } = useChatStore.getState();
    setMode(mode);
    logger.info(`Chat mode set to ${mode} via ChatBridge`);
  }

  // UI Control Methods
  static setPosition(position: ChatPosition | { x: number, y: number }) {
    const { setPosition } = useChatStore.getState();
    setPosition(position);
    logger.info(`Chat position updated via ChatBridge`, { position });
  }

  static toggleDocked() {
    const { toggleDocked } = useChatStore.getState();
    toggleDocked();
    logger.info('Chat docked state toggled via ChatBridge');
  }

  // Feature Control Methods
  static enableFeature(featureKey: string) {
    const { enableFeature } = useChatStore.getState();
    enableFeature(featureKey);
    logger.info(`Feature ${featureKey} enabled via ChatBridge`);
  }

  static disableFeature(featureKey: string) {
    const { disableFeature } = useChatStore.getState();
    disableFeature(featureKey);
    logger.info(`Feature ${featureKey} disabled via ChatBridge`);
  }

  // Settings Methods
  static updateChatSettings(settings: Record<string, any>) {
    const store = useChatStore.getState();
    
    // Update various settings based on the provided object
    Object.entries(settings).forEach(([key, value]) => {
      switch (key) {
        case 'currentMode':
          if (store.setMode && typeof value === 'string') {
            store.setMode(value as ChatMode);
          }
          break;
        case 'features':
          if (typeof value === 'object') {
            Object.entries(value).forEach(([featureKey, enabled]) => {
              if (typeof enabled === 'boolean') {
                store.setFeatureState(featureKey, enabled);
              }
            });
          }
          break;
        // Add other cases as needed
      }
    });
    
    logger.info('Chat settings updated via ChatBridge', { settings });
  }
}

// Optional: Export hook-based methods for use within React components
export function useChatBridge() {
  return {
    sendMessage: ChatBridge.sendMessage,
    openChat: ChatBridge.openChat,
    closeChat: ChatBridge.closeChat,
    toggleChat: ChatBridge.toggleChat,
    clearMessages: ChatBridge.clearMessages,
    setMode: ChatBridge.setMode,
    setPosition: ChatBridge.setPosition,
    toggleDocked: ChatBridge.toggleDocked
  };
}
