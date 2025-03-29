
import { ChatMode, ChatPosition } from '@/types/chat/enums';
import { Message } from '@/types/chat/message';
import { Provider, ProviderModel } from '@/types/chat/providers';
import { FeatureKey } from '../actions/feature/types';

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
