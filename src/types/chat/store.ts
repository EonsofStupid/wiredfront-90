/**
 * Store-specific type definitions for the chat system
 */
import { ChatMode, MessageRole } from './core';
import { Message } from './messages';
import { Session, SessionCreateOptions } from './sessions';
import { ChatPosition } from './ui';

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
  retryMessage: (messageId: string) => Promise<void>;
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

// Chat mode store types
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

// Layout store types
export type { LayoutActions, LayoutState, LayoutStore } from './layout';

// Docking store types
export type { DockingActions, DockingState, DockingStore } from './docking';

// Feature state types
export interface FeatureState {
  voice: boolean;
  rag: boolean;
  modeSwitch: boolean;
  notifications: boolean;
  github: boolean;
  codeAssistant: boolean;
  ragSupport: boolean;
  githubSync: boolean;
  tokenEnforcement: boolean;
  startMinimized: boolean;
  showTimestamps: boolean;
  saveHistory: boolean;
}

// Chat state main types
export interface ChatState {
  initialized: boolean;
  messages: Message[];
  userInput: string;
  isWaitingForResponse: boolean;
  selectedModel: string;
  selectedMode: ChatMode;
  error: string | null;
  chatId: string | null;
  docked: boolean;
  isOpen: boolean;
  isHidden: boolean;
  features: FeatureState;
  currentMode: ChatMode;
  isMinimized: boolean;
  showSidebar: boolean;
  scale: number;
  position: ChatPosition;
}
