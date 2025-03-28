
import { ChatMode, ChatPosition } from '@/types/chat/enums';
import { Message } from './message-types';
import { Provider, ProviderModel } from './provider-types';
import { FeatureKey } from './feature-types';

/**
 * Main chat store state type
 */
export interface ChatState {
  // Initialization
  initialized: boolean;
  
  // Messages and input
  messages: Message[];
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
  docked: boolean;
  isOpen: boolean;
  isMinimized: boolean;
  position: ChatPosition;
  startTime: number;
  
  // Features
  features: Record<FeatureKey, boolean>;
  currentMode: ChatMode;
  
  // Providers
  availableProviders: Provider[];
  currentProvider: Provider | null;
  providers: {
    availableProviders: Provider[];
  };
  
  // UI state
  showSidebar: boolean;
  scale: number;
  ui: {
    sessionLoading: boolean;
    messageLoading: boolean;
    providerLoading: boolean;
  };
  
  // Required actions
  resetChatState: () => void;
  setUserInput: (input: string) => void;
  toggleChat: () => void;
  toggleMinimize: () => void;
  toggleSidebar: () => void;
  toggleDocked: () => void;
  setPosition: (position: ChatPosition) => void;
  setChatId: (id: string | null) => void;
  setMode: (mode: string | ChatMode) => void;
  initializeChat: () => void;
  setSessionLoading: (isLoading: boolean) => void;
  setMessageLoading: (isLoading: boolean) => void;
  setProviderLoading: (isLoading: boolean) => void;
}

/**
 * Represents a chat session in memory
 */
export interface ChatSession {
  id: string;
  title: string;
  created_at: string;
  last_accessed: string;
  message_count: number;
  messages?: Message[];
  metadata?: Record<string, any>;
}

/**
 * Possible chat window states
 */
export type ChatWindowState = 'open' | 'minimized' | 'closed';
