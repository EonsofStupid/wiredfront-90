
import { SessionMetadata } from '@/types/sessions';

export type ChatPosition = 'bottom-left' | 'bottom-right';

export interface Provider {
  id: string;
  name: string;
  description: string;
  category: 'chat' | 'image' | 'audio' | 'code';
  isEnabled: boolean;
  maxTokens?: number;
  contextSize?: number;
}

export interface ChatState {
  initialized: boolean;
  messages: any[];
  userInput: string;
  isWaitingForResponse: boolean;
  selectedModel: string;
  selectedMode: string;
  modelFetchStatus: 'idle' | 'loading' | 'success' | 'error';
  error: Error | null;
  chatId: string | null;
  docked: boolean;
  isOpen: boolean;
  isHidden: boolean;
  position: ChatPosition;
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
    tokenEnforcement: boolean;
  };
  
  currentMode: string;
  availableProviders: Provider[];
  currentProvider: Provider | null;
  
  tokenControl: {
    balance: number;
    enforcementMode: 'never' | 'warn' | 'strict';
    lastUpdated: string | null;
    tokensPerQuery: number;
    freeQueryLimit: number;
    queriesUsed: number;
  };
  
  providers: {
    availableProviders: Provider[];
  };
  
  isMinimized: boolean;
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
}
