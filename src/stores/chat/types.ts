
import { ChatMode, ChatSession, Message } from '@/types/chat';

/**
 * Complete chat state type definition combining all slices
 */
export interface ChatState {
  // Layout state
  isOpen: boolean;
  isMinimized: boolean;
  docked: boolean;
  position: { x: number; y: number };
  scale: number;
  showSidebar: boolean;
  theme: string;
  
  // Messages state
  messages: Message[];
  
  // Session state
  sessions: ChatSession[];
  currentSession: ChatSession | null;
  
  // Mode state
  currentMode: ChatMode;
  
  // Preferences state
  uiPreferences: {
    messageBehavior: 'enter_send';
    notifications: boolean;
    soundEnabled: boolean;
    typingIndicators: boolean;
    showTimestamps: boolean;
  };

  // Layout actions
  toggleOpen: () => void;
  toggleMinimize: () => void;
  toggleDocked: () => void;
  toggleSidebar: () => void;
  setPosition: (position: { x: number; y: number }) => void;
  setScale: (scale: number) => void;
  setTheme: (theme: string) => void;
  
  // Messages actions
  addMessage: (message: Message) => void;
  updateMessage: (id: string, updates: Partial<Message>) => void;
  removeMessage: (id: string) => void;
  clearMessages: () => void;
  sendMessage: (content: string, sessionId: string) => Promise<void>;
  
  // Session actions
  setCurrentSession: (session: ChatSession) => void;
  createSession: () => Promise<ChatSession>;
  updateSession: (session: ChatSession) => void;
  
  // Mode actions
  setCurrentMode: (mode: ChatMode) => void;
  getModeLabel: (mode: ChatMode) => string;
  getModeDescription: (mode: ChatMode) => string;
  
  // Preferences actions
  updatePreferences: (prefs: Partial<ChatState['uiPreferences']>) => void;
}
