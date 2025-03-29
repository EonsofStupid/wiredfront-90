import { ChatMode } from '/enums';

/**
 * Chat bridge events
 */
export type ChatBridgeEvent = 
  | 'message:sent'
  | 'message:received'
  | 'message:error'
  | 'mode:changed'
  | 'state:changed'
  | 'provider:changed'
  | 'settings:updated'
  | 'conversation:changed'
  | 'session:cleared';

/**
 * Event handler type
 */
export type EventHandler<T = any> = (payload: T) => void;

/**
 * Send message options
 */
export interface SendMessageOptions {
  mode?: ChatMode;
  conversationId?: string;
  providerId?: string;
  systemMessage?: string;
  metadata?: Record<string, any>;
  isRetry?: boolean;
}

/**
 * Chat bridge state
 */
export interface ChatBridgeState {
  isOpen: boolean;
  isMinimized: boolean;
  currentMode: ChatMode;
  userInput: string;
  isWaitingResponse: boolean;
  currentProviderId: string | null;
  currentConversationId: string | null;
  features: Record<string, boolean>;
  position: string;
  docked: boolean;
  isMessageLoading: boolean;
}

/**
 * Chat settings interface
 */
export interface ChatSettings {
  apiProvider: string;
  temperature: number;
  maxTokens: number;
  uiPreferences: {
    theme: 'light' | 'dark' | 'system';
    fontSize: 'small' | 'medium' | 'large';
    enterSends: boolean;
    showTimestamps: boolean;
  };
  advancedSettings: {
    codeBlock: {
      copyButton: boolean;
      lineNumbers: boolean;
    };
    streaming: boolean;
    useMarkdown: boolean;
    quickResponses: boolean;
  };
}

/**
 * Chat bridge interface
 */
export interface ChatBridge {
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
  toggleFeature: (key: string) => void;
  togglePosition: () => void;
  toggleDocked: () => void;
  updateTokens: (value: any) => void;
  setAdminSettings: (settings: any) => void;
  sendEvent: (event: string, payload?: any) => void;
  createConversation: (params: any) => void;
  switchConversation: (id: string) => void;
  archiveConversation: (id: string) => void;
  deleteConversation: (id: string) => void;
  toggleChat: () => void;
}
