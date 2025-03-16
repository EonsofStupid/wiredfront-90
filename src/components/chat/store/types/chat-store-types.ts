
export type ChatPosition = 'bottom-right' | 'bottom-left' | { x: number, y: number };

export type SelectedMode = 'chat' | 'dev' | 'image' | 'training';

export type ChatMode = 'chat' | 'chat-only' | 'dev' | 'image' | 'training';

export interface TokenControl {
  balance: number;
  enforcementMode: 'always' | 'warn' | 'never';
  lastUpdated: string | null;
  tokensPerQuery: number;
  freeQueryLimit: number;
  queriesUsed: number;
}

export interface ProviderCategory {
  id: string;
  name: string;
  description: string;
  models: string[];
  supportsStreaming: boolean;
  icon?: string;
  category: 'chat' | 'image' | 'vector' | 'voice' | 'other';
  costPerToken?: number;
}

export interface UI {
  sessionLoading: boolean;
  messageLoading: boolean;
  providerLoading: boolean;
}

export interface ProvidersState {
  availableProviders: ProviderCategory[];
}

export interface ChatState {
  initialized: boolean;
  messages: any[];
  userInput: string;
  isWaitingForResponse: boolean;
  selectedModel: string;
  selectedMode: string;
  currentMode: ChatMode;
  modelFetchStatus: 'idle' | 'loading' | 'success' | 'error';
  error: string | null;
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
  tokenControl: TokenControl;
  providers: ProvidersState;
  availableProviders: ProviderCategory[];
  currentProvider: ProviderCategory | null;
  isMinimized: boolean;
  showSidebar: boolean;
  scale: number;
  ui: UI;
  
  // Actions for messages
  addMessage: (message: any) => void;
  updateMessage: (id: string, updates: any) => void;
  resetChatState: () => void;
  setUserInput: (input: string) => void;
  togglePosition: () => void;
  toggleDocked: () => void;
  setScale: (scale: number) => void;
}
