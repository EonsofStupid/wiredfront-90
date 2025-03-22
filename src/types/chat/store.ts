
import { ChatMode } from './modes';

/**
 * Chat Mode Store - Manages the current chat mode and transitions
 */
export interface ModeStore {
  // State
  currentMode: ChatMode;
  previousMode: ChatMode | null;
  isTransitioning: boolean;
  transitionProgress: number;
  
  // Actions
  setMode: (mode: ChatMode) => void;
  switchMode: (mode: ChatMode) => Promise<boolean>;
  cancelTransition: () => void;
  resetMode: () => void;
}

/**
 * Chat Message Store - Manages the chat messages
 */
export interface MessageStore {
  // State
  messages: any[]; // Replace with proper Message type
  isLoading: boolean;
  error: Error | null;
  
  // Actions
  sendMessage: (content: string) => Promise<void>;
  addMessage: (message: any) => void; // Replace with proper Message type
  updateMessage: (id: string, updates: Partial<any>) => void; // Replace with proper Message type
  removeMessage: (id: string) => void;
  clearMessages: () => void;
}

/**
 * Chat Session Store - Manages chat sessions
 */
export interface SessionStore {
  // State
  currentSession: string | null;
  sessions: Record<string, any>; // Replace with proper Session type
  
  // Actions
  createSession: () => string;
  updateSession: (id: string, updates: Partial<any>) => void; // Replace with proper Session type
  deleteSession: (id: string) => void;
}

/**
 * Chat Layout Store - Manages the chat UI layout
 */
export interface LayoutStore {
  // State
  isOpen: boolean;
  isMinimized: boolean;
  docked: boolean;
  position: { x: number; y: number };
  scale: number;
  showSidebar: boolean;
  
  // Actions
  toggleOpen: () => void;
  toggleMinimize: () => void;
  toggleDocked: () => void;
  toggleSidebar: () => void;
  setPosition: (position: { x: number; y: number }) => void;
}
