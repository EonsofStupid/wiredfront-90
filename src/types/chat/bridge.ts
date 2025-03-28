
import { ChatMode, MessageRole, MessageType } from './enums';
import { Conversation } from './conversation';
import { Provider } from './providers';

/**
 * Options for sending a message through the bridge
 */
export interface SendMessageOptions {
  conversationId?: string;
  role?: MessageRole;
  type?: MessageType;
  metadata?: Record<string, any>;
  parentMessageId?: string;
}

/**
 * Current state of the chat bridge
 */
export interface ChatBridgeState {
  isOpen: boolean;
  isMinimized: boolean;
  currentMode: ChatMode;
  currentProvider: Provider | null;
  currentConversationId: string | null;
  isMessageLoading: boolean;
  features: {
    voice: boolean;
    rag: boolean;
    modeSwitch: boolean;
    notifications: boolean;
    github: boolean;
    codeAssistant: boolean;
    ragSupport: boolean;
    githubSync: boolean;
    knowledgeBase: boolean;
    tokenEnforcement: boolean;
  };
}

/**
 * ChatBridge interface - the main communication channel 
 * between the app and the chat components
 */
export interface ChatBridge {
  // Conversation operations
  createConversation(params?: { title?: string, mode?: ChatMode }): Promise<string>;
  switchConversation(conversationId: string): Promise<boolean>;
  updateConversation(conversationId: string, updates: Partial<Conversation>): Promise<boolean>;
  archiveConversation(conversationId: string): Promise<boolean>;

  // Message operations
  sendMessage(content: string, options?: SendMessageOptions): Promise<string>;
  updateMessage(messageId: string, content: string): Promise<boolean>;
  deleteMessage(messageId: string): Promise<boolean>;

  // Mode and provider management
  setMode(mode: ChatMode): Promise<boolean>;
  setProvider(providerId: string): Promise<boolean>;

  // UI control
  openChat(): void;
  closeChat(): void;
  toggleChat(): void;
  minimizeChat(): void;
  maximizeChat(): void;
  togglePosition(): void;
  toggleDocked(): void;
  toggleFeature(featureKey: string): void;

  // Event management
  on(eventType: string, callback: Function): () => void;
  off(eventType: string, callback: Function): void;

  // State getters
  getCurrentConversationId(): string | null;
  getCurrentMode(): ChatMode;
  getCurrentProvider(): Provider | null;
  getState(): ChatBridgeState;

  // Settings management
  setUserSettings(settings: Record<string, any>): void;
  getUserSettings(): Record<string, any>;
  setAdminSettings(settings: Record<string, any>): void;
  getAdminSettings(): Record<string, any>;
}
