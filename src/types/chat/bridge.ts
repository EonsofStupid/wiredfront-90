
import { ChatMode, MessageRole, MessageType } from './enums';
import { Conversation } from './conversation';
import { Message } from './message';
import { Provider } from './providers';

/**
 * ChatBridge interface - the communication layer between app and chat components
 */
export interface ChatBridge {
  // Conversation management
  createConversation: (params?: { title?: string, mode?: ChatMode }) => Promise<string>; 
  switchConversation: (conversationId: string) => Promise<boolean>;
  updateConversation: (conversationId: string, updates: Partial<Conversation>) => Promise<boolean>;
  archiveConversation: (conversationId: string) => Promise<boolean>;
  
  // Message operations
  sendMessage: (content: string, options?: SendMessageOptions) => Promise<string>;
  updateMessage: (messageId: string, content: string) => Promise<boolean>;
  deleteMessage: (messageId: string) => Promise<boolean>;
  
  // Mode and provider management
  setMode: (mode: ChatMode) => Promise<boolean>;
  setProvider: (providerId: string) => Promise<boolean>;
  
  // UI control
  openChat: () => void;
  closeChat: () => void;
  toggleChat: () => void;
  minimizeChat: () => void;
  maximizeChat: () => void;
  
  // Current state getters
  getCurrentConversationId: () => string | null;
  getCurrentMode: () => ChatMode;
  getCurrentProvider: () => Provider | null;
}

/**
 * Options for sending a message
 */
export interface SendMessageOptions {
  role?: MessageRole;
  type?: MessageType;
  metadata?: Record<string, any>;
  parentMessageId?: string;
  conversationId?: string;
}

/**
 * Chat bridge state interface
 */
export interface ChatBridgeState {
  // Current state
  isOpen: boolean;
  isMinimized: boolean;
  currentMode: ChatMode;
  currentProvider: Provider | null;
  currentConversationId: string | null;
  
  // Message state
  isMessageLoading: boolean;
  
  // Feature flags
  features: {
    [key: string]: boolean;
  };
}
