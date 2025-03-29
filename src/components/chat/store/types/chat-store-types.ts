
import { ChatMode, ChatPosition } from '@/components/chat/types/chat/enums';
import { Provider } from '@/components/chat/types/provider-types';
import { TokenBalance } from '@/components/chat/types/token';
import { FeatureKey } from '@/components/chat/types/feature-types';

/**
 * Type for UI chat mode
 */
export type UiChatMode = 'standard' | 'editor' | 'image' | 'training' | 'planning' | 'code' | 'document';

/**
 * Chat provider type for stores
 */
export interface ChatProvider {
  id: string;
  name: string;
  apiKey: string;
  type: string;
  isDefault: boolean;
  isActive: boolean;
}

/**
 * Chat session state interface
 */
export interface ChatSessionState {
  id: string;
  name: string;
  mode: ChatMode;
  provider: string | null;
  createdAt: Date;
  messages: any[];
  isActive: boolean;
}

/**
 * Chat state interface
 */
export interface ChatState {
  initialized: boolean;
  isOpen: boolean;
  isMinimized: boolean;
  docked: boolean;
  showSidebar: boolean;
  scale: number;
  
  // Input state
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
  currentSession: ChatSessionState | null;
  sessions: Record<string, ChatSessionState>;
  
  // Position state
  position: ChatPosition;
  
  // Features
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

  // Token balance
  tokenBalance?: TokenBalance;
  
  // UI state
  ui: {
    sessionLoading: boolean;
    messageLoading: boolean;
    providerLoading: boolean;
  };
  
  // Custom styles
  customStyles: Record<string, string>;
  
  // Required actions to be implemented
  resetChatState: () => void;
  setUserInput: (input: string) => void;
  toggleChat: () => void;
  toggleMinimize: () => void;
  toggleSidebar: () => void;
  toggleDocked: () => void;
  resetInput: () => void;
  setError: (error: Error | null) => void;
  setCurrentSession: (session: ChatSessionState | null) => void;
  setChatId: (id: string | null) => void;
  setMode: (mode: ChatMode | string) => void;
  setPosition: (position: ChatPosition) => void;
  initializeChat: () => void;
  setSessionLoading: (loading: boolean) => void;
  setMessageLoading: (loading: boolean) => void;
  setProviderLoading: (loading: boolean) => void;
}
