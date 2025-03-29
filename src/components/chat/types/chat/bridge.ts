
import { MessageRole, ChatMode, TaskType } from './enums';

/**
 * Event handler function type
 */
export type EventHandler<T = any> = (payload: T) => void;

/**
 * Chat bridge event types
 */
export type ChatBridgeEvent = 
  | 'message'
  | 'response'
  | 'error'
  | 'tokenUsage'
  | 'settingsChanged'
  | 'userSettingsChanged'
  | 'modeChanged'
  | 'statusChange'
  | 'conversationCreated'
  | 'conversationDeleted'
  | 'conversationArchived'
  | 'featureToggled';

/**
 * Chat bridge interface
 */
export interface ChatBridgeInterface {
  // Event handling
  on: <T = any>(event: ChatBridgeEvent, handler: EventHandler<T>) => () => void;
  off: <T = any>(event: ChatBridgeEvent, handler: EventHandler<T>) => void;
  emit: <T = any>(event: ChatBridgeEvent, payload: T) => void;
  
  // Core methods
  sendMessage: (message: string, options?: SendMessageOptions) => Promise<string>;
  getMessages: (conversationId?: string, limit?: number) => Promise<any[]>;
  clearMessages: () => Promise<void>;
  
  // State management
  getState: () => ChatBridgeState;
  setState: (state: Partial<ChatBridgeState>) => void;
  
  // Mode management
  setMode: (mode: ChatMode) => void;
  getMode: () => ChatMode;
  
  // Settings
  updateSettings: (settings: Partial<ChatSettings>) => void;
  getSettings: () => ChatSettings;
  
  // Utility methods
  getProvider: () => string | null;
  setProvider: (providerId: string) => void;
}

/**
 * Chat bridge state interface
 */
export interface ChatBridgeState {
  isOpen: boolean;
  isMinimized: boolean;
  isWaitingForResponse: boolean;
  currentMode: ChatMode;
  currentProvider: string | null;
  currentConversationId: string | null;
  userInput: string;
}

/**
 * Chat settings interface
 */
export interface ChatSettings {
  defaultMode: ChatMode;
  defaultProvider: string | null;
  position: 'bottom-right' | 'bottom-left' | 'top-right' | 'top-left';
  features: Record<string, boolean>;
  theme: string;
  scale: number;
  notifications: boolean;
  autoOpen: boolean;
  tokenEnforcement: 'none' | 'warn' | 'strict';
}

/**
 * Send message options interface
 */
export interface SendMessageOptions {
  conversationId?: string;
  role?: MessageRole;
  taskType?: TaskType;
  mode?: ChatMode;
  systemPrompt?: string;
  metadata?: Record<string, any>;
}
