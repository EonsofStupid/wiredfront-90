
import { 
  ChatMode, 
  Message, 
  MessageRole, 
  MessageStatus, 
  Session, 
  SessionCreateOptions 
} from '@/types/chat';

// Message store types
export interface MessageState {
  messages: Message[];
  isLoading: boolean;
  error: Error | null;
}

export interface MessageActions {
  addMessage: (message: Message) => string;
  updateMessage: (id: string, updates: Partial<Message>) => void;
  removeMessage: (id: string) => void;
  fetchMessages: (sessionId: string) => Promise<void>;
  clearMessages: () => void;
  sendMessage: (content: string, sessionId: string, role?: MessageRole) => Promise<string>;
}

export type MessageStore = MessageState & MessageActions;

// Session store types
export interface SessionState {
  sessions: Session[];
  currentSession: Session | null;
  isLoading: boolean;
  error: Error | null;
}

export interface SessionActions {
  fetchSessions: () => Promise<void>;
  setCurrentSession: (session: Session) => void;
  clearSessions: () => void;
  createSession: (options?: SessionCreateOptions) => Promise<Session>;
  updateSession: (sessionId: string, updates: Partial<Session>) => Promise<void>;
  deleteSession: (sessionId: string) => Promise<void>;
}

export type SessionStore = SessionState & SessionActions;

// Mode store types
export interface ModeState {
  currentMode: ChatMode;
  previousMode: ChatMode | null;
  isTransitioning: boolean;
  transitionProgress: number;
}

export interface ModeActions {
  setMode: (mode: ChatMode) => void;
  switchMode: (mode: ChatMode) => Promise<void>;
  cancelTransition: () => void;
  resetMode: () => void;
}

export type ModeStore = ModeState & ModeActions;
