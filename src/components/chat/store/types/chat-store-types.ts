
import { ChatMode, ChatPositionType } from '@/types/chat/enums';
import { Message } from '@/types/chat/message';

/**
 * Provider interface
 */
export interface Provider {
  id: string;
  name: string;
  maxTokens: number;
  description?: string;
  apiType?: string;
  models?: string[];
  isDefault?: boolean;
  icon?: string;
}

/**
 * Chat state interface
 */
export interface ChatState {
  // UI State
  isOpen: boolean;
  isMinimized: boolean;
  showSidebar: boolean;
  position: ChatPositionType;
  docked: boolean;
  scale: number;
  initialized: boolean;
  error: Error | null;
  
  // Session State
  userInput: string;
  messages: Message[];
  chatId: string | null;
  isWaitingForResponse: boolean;
  currentMode: ChatMode;
  selectedModel: string;
  selectedMode: string;
  modelFetchStatus: 'idle' | 'loading' | 'success' | 'error';
  startTime: number | null;
  
  // Feature Toggles
  features: {
    githubSync: boolean;
    knowledgeBase: boolean;
    notifications: boolean;
    voice: boolean;
    rag: boolean;
    modeSwitch: boolean;
    codeAssistant: boolean;
    ragSupport: boolean;
    tokenEnforcement: boolean;
    github: boolean;
  };
  
  // Provider State
  currentProvider: Provider | null;
  availableProviders: Provider[];
  providers: {
    availableProviders: Provider[];
  };
  
  // UI Loading States
  ui: {
    sessionLoading: boolean;
    messageLoading: boolean;
    providerLoading: boolean;
  };
  
  // Actions
  toggleChat: () => void;
  toggleMinimize: () => void;
  toggleSidebar: () => void;
  toggleDocked: () => void;
  togglePosition: () => void;
  setPosition: (position: ChatPositionType) => void;
  setUserInput: (input: string) => void;
  setChatId: (id: string | null) => void;
  setMode: (mode: ChatMode) => void;
  initializeChat: () => void;
  setSessionLoading: (loading: boolean) => void;
  setMessageLoading: (loading: boolean) => void;
  setProviderLoading: (loading: boolean) => void;
  resetChatState: () => void;
}
