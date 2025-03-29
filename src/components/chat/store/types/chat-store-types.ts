
import { ChatMode, ChatPosition } from '@/types/chat/enums';
import { Message } from '@/components/chat/types/message-types';
import { Provider } from '@/components/chat/types/provider-types';

// Export ChatProvider for backward compatibility
export type { Provider as ChatProvider } from '@/components/chat/types/provider-types';

// Define UI chat mode as a union type
export type UiChatMode = 'standard' | 'editor' | 'image' | 'training' | 'planning' | 'code' | 'document' | 'audio';

// Chat UI state interface
export interface ChatUIState {
  isOpen: boolean;
  isMinimized: boolean;
  isDocked: boolean;
  position: ChatPosition;
  scale: number;
  showSidebar: boolean;
  sessionLoading: boolean;
  messageLoading: boolean;
  providerLoading: boolean;
}

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
  
  // Optional token balance
  tokenBalance?: number;
  
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
 * Feature keys for the chat store
 */
export type FeatureKey = 
  | 'voice'
  | 'rag'
  | 'modeSwitch'
  | 'notifications'
  | 'github'
  | 'codeAssistant'
  | 'ragSupport'
  | 'githubSync'
  | 'knowledgeBase'
  | 'tokenEnforcement';

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
