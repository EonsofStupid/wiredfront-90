
import { 
  ChatMode, 
  ChatPosition,
  MessageStatus
} from '@/types/chat/enums';
import { Message } from '@/components/chat/types/message-types';
import { Provider } from '@/components/chat/types/provider-types';
import { Features } from '@/components/chat/types/feature-types';

export type ModelFetchStatus = 'idle' | 'loading' | 'success' | 'error';

export type UiChatMode = 'standard' | 'editor' | 'image' | 'training' | 'planning' | 'code' | 'document' | 'audio';

/**
 * Structure of a chat window state
 */
export interface ChatWindowState {
  isMinimized: boolean;
  position: ChatPosition;
  showSidebar: boolean;
  scale: number;
}

/**
 * Structure of a chat session
 */
export interface ChatSession {
  id: string;
  title: string;
  created_at: string;
  last_accessed: string;
  messages: Message[];
  status: MessageStatus;
  mode: ChatMode;
  provider_id?: string;
  archived?: boolean;
}

/**
 * Chat UI state
 */
export interface ChatUIState {
  sessionLoading: boolean;
  messageLoading: boolean;
  providerLoading: boolean;
}

/**
 * Main chat state interface
 */
export interface ChatState {
  initialized: boolean;
  messages: Message[];
  userInput: string;
  isWaitingForResponse: boolean;
  selectedModel: string;
  selectedMode: 'chat' | 'dev' | 'image' | 'training';
  modelFetchStatus: ModelFetchStatus;
  error: string | null;
  chatId: string | null;
  docked: boolean;
  isOpen: boolean;
  isMinimized: boolean;
  position: ChatPosition;
  startTime: number;
  features: Features;
  currentMode: ChatMode;
  availableProviders: Provider[];
  currentProvider: Provider | null;
  
  providers: {
    availableProviders: Provider[];
    currentProvider?: Provider | null;
  };
  
  showSidebar: boolean;
  scale: number;
  ui: ChatUIState;
  
  // For token management, optional
  tokenBalance?: number;
  
  // Required store actions
  resetChatState: () => void;
  setUserInput: (input: string) => void;
  toggleChat: () => void;
  toggleMinimize: () => void;
  toggleSidebar: () => void;
  toggleDocked: () => void;
  setPosition: (position: ChatPosition) => void;
  setChatId: (chatId: string | null) => void;
  setMode: (mode: ChatMode | string) => void;
  initializeChat: () => void;
  setSessionLoading: (loading: boolean) => void;
  setMessageLoading: (loading: boolean) => void;
  setProviderLoading: (loading: boolean) => void;
}
