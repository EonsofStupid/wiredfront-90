
import { 
  ChatMode, 
  MessageRole,
  TaskType 
} from './enums';

/**
 * ChatBridge events
 */
export type ChatBridgeEvent = 
  | 'message_sent'
  | 'message_received'
  | 'message_error'
  | 'mode_changed'
  | 'provider_changed'
  | 'settings_updated'
  | 'conversation_created'
  | 'conversation_updated'
  | 'conversation_deleted'
  | 'session_started'
  | 'session_ended'
  | 'state_changed'
  | 'initialized'
  | 'connection_error'
  | 'token_updated';

/**
 * Event handler type
 */
export type EventHandler<T = any> = (payload: T) => void;

/**
 * Options for sending a message
 */
export interface SendMessageOptions {
  conversationId?: string;
  parentMessageId?: string;
  metadata?: Record<string, any>;
  role?: MessageRole;
  systemPrompt?: string;
  stream?: boolean;
}

/**
 * ChatBridge settings
 */
export interface ChatSettings {
  defaultMode: ChatMode;
  defaultProvider: string | null;
  autoSwitch: boolean;
  interface: {
    position: string;
    theme: string;
    scale: number;
  };
  features: {
    voice: boolean;
    rag: boolean;
    modeSwitch: boolean;
    notifications: boolean;
    tokenEnforcement: boolean;
  };
  preferences: Record<string, any>;
}

/**
 * ChatBridge state interface
 */
export interface ChatBridgeState {
  isInitialized: boolean;
  isOpen: boolean;
  isMinimized: boolean;
  currentMode: ChatMode;
  currentProvider: string | null;
  currentConversationId: string | null;
  settings: ChatSettings;
  userInput: string;
  isWaitingForResponse: boolean;
}

/**
 * ChatBridge implementation interface
 */
export interface ChatBridgeInterface {
  sendMessage: (message: string, options?: SendMessageOptions) => Promise<string>;
  getMessages: (conversationId?: string, limit?: number) => Promise<any[]>;
  clearMessages: () => Promise<void>;
  getState: () => ChatBridgeState;
  setState: (state: Partial<ChatBridgeState>) => void;
  setMode: (mode: ChatMode) => boolean;
  getCurrentMode: () => ChatMode;
  updateSettings: (settings: Partial<ChatSettings>) => void;
  getSettings: () => ChatSettings;
  getProvider: () => string | null;
  setProvider: (providerId: string) => void;
  on: <T = any>(event: ChatBridgeEvent, handler: EventHandler<T>) => () => void;
  off: <T = any>(event: ChatBridgeEvent, handler: EventHandler<T>) => void;
  emit: <T = any>(event: ChatBridgeEvent, payload: T) => void;
}
