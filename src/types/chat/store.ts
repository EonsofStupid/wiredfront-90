
/**
 * Store-specific type definitions for the chat system
 */
import { ChatMode, MessageRole, MessageStatus } from './core';
import { ChatLayoutState, ChatPosition, ChatUIPreferences, DockPosition } from './ui';
import { Message, Session } from './database';

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

export interface SessionCreateOptions {
  title?: string;
  mode?: ChatMode;
  metadata?: Record<string, any>;
  provider_id?: string;
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

// Layout store types using Jotai
export interface LayoutState {
  isMinimized: boolean;
  scale: number;
  showSidebar: boolean;
  uiPreferences: ChatUIPreferences;
}

export interface LayoutActions {
  setMinimized: (isMinimized: boolean) => void;
  toggleMinimized: () => void;
  setScale: (scale: number) => void;
  toggleSidebar: () => void;
  setSidebar: (visible: boolean) => void;
  updateUIPreferences: (preferences: Partial<ChatUIPreferences>) => void;
  resetLayout: () => void;
  
  // Persistence methods
  saveLayoutToStorage: () => Promise<boolean>;
  loadLayoutFromStorage: () => Promise<boolean>;
}

export type LayoutStore = LayoutState & LayoutActions;

// Docking store types using Jotai
export interface DockingState {
  docked: boolean;
  position: ChatPosition;
  dockedItems: Record<string, DockPosition>;
}

export interface DockingActions {
  setDocked: (docked: boolean) => void;
  toggleDocked: () => void;
  setPosition: (position: ChatPosition) => void;
  setDockedItem: (id: string, position: DockPosition) => void;
  resetDocking: () => void;
  
  // Persistence methods
  saveDockingToStorage: () => Promise<boolean>;
  loadDockingFromStorage: () => Promise<boolean>;
}

export type DockingStore = DockingState & DockingActions;
