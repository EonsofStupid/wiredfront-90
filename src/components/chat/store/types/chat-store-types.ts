
import { ChatMode, ChatPosition } from '@/types/chat/enums';
import { Message } from '../../types/message-types';
import { Provider } from '../../types/provider-types';
import { FeatureKey } from '../../types/feature-types';

/**
 * UI state for chat components
 */
export interface ChatUIState {
  sessionLoading: boolean;
  messageLoading: boolean;
  providerLoading: boolean;
}

/**
 * Full chat state including all required properties
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
  
  // Legacy session state (to be migrated)
  currentSession: any | null;
  sessions: Record<string, any>;
  
  // Features
  features: Record<FeatureKey, boolean>;
  currentMode: ChatMode;
  
  // Providers
  availableProviders: Provider[];
  currentProvider: Provider | null;
  providers: {
    availableProviders: Provider[];
    currentProvider: Provider | null;
  };
  
  // UI state
  showSidebar: boolean;
  scale: number;
  ui: ChatUIState;
  
  // Custom styles (for theming)
  customStyles: Record<string, any>;
  
  // Token management
  tokenBalance?: {
    available: number;
    used: number;
    total: number;
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

/**
 * UI-friendly representation of chat modes
 */
export type UiChatMode = 'standard' | 'editor' | 'image' | 'training' | 'planning' | 'code' | 'document' | 'audio';
