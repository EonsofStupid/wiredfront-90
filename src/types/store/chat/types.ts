import { Message } from '@/components/chat/shared/schemas/messages';
import { ConnectionState } from '@/components/chat/store/types/chat-store-types';

export interface ChatSession {
  id: string;
  messages: Message[];
  isMinimized: boolean;
  position: { x: number; y: number };
  isTacked: boolean;
  lastAccessed: Date;
}

export interface ChatPreferences {
  messageBehavior: 'enter_send';
  notifications: boolean;
  soundEnabled: boolean;
  typingIndicators: boolean;
}

export interface ChatStore {
  sessions: Record<string, ChatSession>;
  currentSessionId: string | null;
  connectionState: ConnectionState;
  preferences: ChatPreferences;
  isInitialized: boolean;
  initialize: () => void;
  createSession: () => string;
  switchSession: (sessionId: string) => void;
  updateSession: (sessionId: string, updates: Partial<ChatSession>) => void;
  addMessage: (sessionId: string, message: any) => void;
  updatePreferences: (updates: Partial<ChatPreferences>) => void;
  setConnectionState: (state: ConnectionState) => void;
  removeSession: (sessionId: string) => void;
}
