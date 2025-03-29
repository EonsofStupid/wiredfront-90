
import { ChatMode, ChatPosition } from '@/types/chat/enums';
import { FeatureKey } from '@/components/chat/types/feature-types';
import { Provider } from '@/components/chat/types/provider-types';

/**
 * Chat Session interface
 */
export interface ChatSession {
  id: string;
  startTime: number;
  endTime?: number;
  messages: any[];
  metadata: Record<string, any>;
}

/**
 * Chat UI state interface
 */
export interface ChatUIState {
  sessionLoading: boolean;
  messageLoading: boolean;
  providerLoading: boolean;
}

/**
 * Chat window state
 */
export interface ChatWindowState {
  isOpen: boolean;
  isMinimized: boolean;
  docked: boolean;
  showSidebar: boolean;
  scale: number;
  position: ChatPosition;
}

/**
 * Core Chat State interface for Zustand store
 */
export interface ChatState {
  // Basic state
  messages: any[];
  userInput: string;
  isWaitingForResponse: boolean;
  
  // Selection state
  selectedModel: string;
  selectedMode: string;
  
  // UI status
  modelFetchStatus: 'idle' | 'loading' | 'success' | 'error';
  error: Error | null;
  
  // Session state
  chatId: string | null;
  startTime: number;
  currentSession: ChatSession | null;
  sessions: Record<string, ChatSession>;
  
  // Position state
  position: ChatPosition;
  
  // Feature state
  features: Record<FeatureKey, boolean>;
  
  // Current mode
  currentMode: ChatMode;
  
  // Provider state
  availableProviders: Provider[];
  currentProvider: Provider | null;
  
  providers: {
    currentProvider: Provider | null;
    availableProviders: Provider[];
  };
  
  // Window state
  isOpen: boolean;
  isMinimized: boolean;
  docked: boolean;
  showSidebar: boolean;
  scale: number;
  
  // UI state
  ui: ChatUIState;
  
  // Custom styles
  customStyles: Record<string, any>;
  
  // Required actions (implemented by action creators)
  resetChatState: () => void;
  setUserInput: (input: string) => void;
  toggleChat: () => void;
  toggleMinimize: () => void;
  toggleSidebar: () => void;
  toggleDocked: () => void;
  resetInput: () => void;
  setError: (error: Error | null) => void;
  setCurrentSession: (session: ChatSession | null) => void;
  setChatId: (id: string | null) => void;
  setMode: (mode: ChatMode) => void;
  setPosition: (position: ChatPosition) => void;
  setSessionLoading: (isLoading: boolean) => void;
  setMessageLoading: (isLoading: boolean) => void;
  setProviderLoading: (isLoading: boolean) => void;
}
