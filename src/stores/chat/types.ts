import { Message } from '@/types/chat';
import { ConnectionState } from '@/types/websocket';

export interface ChatSession {
  id: string;
  messages: Message[];
  isMinimized: boolean;
  position: { x: number; y: number };
  isTacked: boolean;
  lastAccessed: Date;
}

export interface ChatState {
  sessions: Record<string, ChatSession>;
  currentSessionId: string | null;
  connectionState: ConnectionState;
  isInitialized: boolean;
  preferences: {
    messageBehavior: 'enter_send' | 'enter_newline';
    notifications: boolean;
    soundEnabled: boolean;
    typingIndicators: boolean;
  };
}

export interface ChatActions {
  initialize: () => void;
  createSession: () => string;
  switchSession: (sessionId: string) => void;
  updateSession: (sessionId: string, updates: Partial<ChatSession>) => void;
  addMessage: (sessionId: string, message: Message) => void;
  updatePreferences: (updates: Partial<ChatState['preferences']>) => void;
  setConnectionState: (state: ConnectionState) => void;
  removeSession: (sessionId: string) => void;
}

export type ChatStore = ChatState & ChatActions;