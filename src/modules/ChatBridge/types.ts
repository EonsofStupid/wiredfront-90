
import { 
  ChatMode, 
  MessageRole,
  TaskType 
} from '@/components/chat/types/chat/enums';
import { 
  ChatBridgeEvent, 
  ChatBridgeInterface, 
  ChatBridgeState, 
  ChatSettings,
  EventHandler,
  SendMessageOptions 
} from '@/components/chat/types/chat/bridge';

export {
  ChatBridgeEvent,
  ChatBridgeInterface,
  ChatBridgeState,
  ChatSettings,
  EventHandler,
  SendMessageOptions
};

/**
 * ChatBridge context type
 */
export interface ChatBridgeContextType {
  isInitialized: boolean;
  sendMessage: (message: string, options?: SendMessageOptions) => Promise<string>;
  getMessages: (conversationId?: string, limit?: number) => Promise<any[]>;
  clearMessages: () => Promise<void>;
  getState: () => ChatBridgeState;
  setState: (state: Partial<ChatBridgeState>) => void;
  setMode: (mode: ChatMode) => void;
  getMode: () => ChatMode;
  updateSettings: (settings: Partial<ChatSettings>) => void;
  getSettings: () => ChatSettings;
  getProvider: () => string | null;
  setProvider: (providerId: string) => void;
  on: <T = any>(event: ChatBridgeEvent, handler: EventHandler<T>) => () => void;
  off: <T = any>(event: ChatBridgeEvent, handler: EventHandler<T>) => void;
  emit: <T = any>(event: ChatBridgeEvent, payload: T) => void;
}

/**
 * Action types for ChatBridge reducer
 */
export enum ChatBridgeActionType {
  SET_STATE = 'SET_STATE',
  SET_MODE = 'SET_MODE',
  SET_PROVIDER = 'SET_PROVIDER',
  SET_CONVERSATION = 'SET_CONVERSATION',
  SET_IS_OPEN = 'SET_IS_OPEN',
  SET_IS_MINIMIZED = 'SET_IS_MINIMIZED',
  SET_USER_INPUT = 'SET_USER_INPUT',
  SET_WAITING_RESPONSE = 'SET_WAITING_RESPONSE',
  RESET_STATE = 'RESET_STATE'
}

/**
 * ChatBridge action interface
 */
export interface ChatBridgeAction {
  type: ChatBridgeActionType;
  payload?: any;
}

/**
 * ChatBridge dispatch function type
 */
export type ChatBridgeDispatch = (action: ChatBridgeAction) => void;
