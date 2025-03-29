
import { ChatMode, MessageRole, MessageStatus, MessageType } from './enums';

/**
 * Core Chat UI state
 */
export interface ChatUIState {
  sessionLoading: boolean;
  messageLoading: boolean;
  providerLoading: boolean;
}

/**
 * Basic chat state for the store
 */
export interface ChatState {
  initialized: boolean;
  messages: any[];
  userInput: string;
  isWaitingForResponse: boolean;
  selectedModel: string;
  selectedMode: string;
  modelFetchStatus: 'idle' | 'loading' | 'success' | 'error';
  error: string | null;
  chatId: string | null;
  isOpen: boolean;
  isMinimized: boolean;
  position: 'bottom-right' | 'bottom-left';
  startTime: number;
  features: {
    voice: boolean;
    rag: boolean;
    modeSwitch: boolean;
    notifications: boolean;
    github: boolean;
    codeAssistant: boolean;
    ragSupport: boolean;
    githubSync: boolean;
    knowledgeBase: boolean;
    tokenEnforcement: boolean;
  };
  currentMode: ChatMode | string;
  availableProviders: any[];
  currentProvider: any;
  providers: {
    availableProviders: any[];
  };
  showSidebar: boolean;
  scale: number;
  ui: ChatUIState;
  
  // Core actions
  resetChatState: () => void;
  setUserInput: (input: string) => void;
  toggleChat: () => void;
  toggleMinimize: () => void;
  toggleSidebar: () => void;
  toggleDocked: () => void;
  setPosition: (position: 'bottom-right' | 'bottom-left') => void;
  setChatId: (id: string | null) => void;
  setMode: (mode: ChatMode) => void;
  initializeChat: () => void;
  
  // UI state management
  setSessionLoading: (isLoading: boolean) => void;
  setMessageLoading: (isLoading: boolean) => void;
  setProviderLoading: (isLoading: boolean) => void;
}
