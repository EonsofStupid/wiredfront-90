
import { Provider } from '../../types/provider-types';
import { ChatMode, ChatPosition } from '@/types/chat/enums';
import { Features } from '../../types/feature-types';
import { Message } from '@/types/chat/message';

export type UiChatMode = 'standard' | 'editor' | 'image' | 'training' | 'planning' | 'code' | 'document' | 'audio';

/**
 * State associated with a chat session
 */
export interface ChatSession {
  id: string;
  title: string;
  createdAt: string;
  updatedAt: string;
  lastAccessed: string;
  messageCount: number;
  archived: boolean;
}

/**
 * State for the chat window dimensions
 */
export interface ChatWindowState {
  width: number;
  height: number;
  x: number;
  y: number;
}

/**
 * Core chat state
 */
export interface ChatState {
  // Core state
  initialized: boolean;
  messages: Message[];
  userInput: string;
  isWaitingForResponse: boolean;
  selectedModel: string;
  selectedMode: string;
  modelFetchStatus: 'idle' | 'loading' | 'success' | 'error';
  error: Error | null;
  chatId: string | null;
  
  // UI state
  docked: boolean;
  isOpen: boolean;
  isMinimized: boolean;
  position: ChatPosition;
  startTime: number;
  showSidebar: boolean;
  scale: number;
  tokenBalance?: number;
  
  // Features
  features: Features;
  currentMode: ChatMode | string;
  
  // Providers
  availableProviders: Provider[];
  currentProvider: Provider | null;
  providers: {
    availableProviders: Provider[];
  };
  
  // UI state objects
  ui: {
    sessionLoading: boolean;
    messageLoading: boolean;
    providerLoading: boolean;
  };
  
  // Required actions (implemented in store)
  resetChatState: () => void;
  setUserInput: (input: string) => void;
  toggleChat: () => void;
  toggleMinimize: () => void;
  toggleSidebar: () => void;
  toggleDocked: () => void;
  setPosition: (position: ChatPosition) => void;
  setChatId: (id: string | null) => void;
  setMode: (mode: ChatMode | string) => void;
  initializeChat: () => void;
  setSessionLoading: (loading: boolean) => void;
  setMessageLoading: (loading: boolean) => void;
  setProviderLoading: (loading: boolean) => void;
}
