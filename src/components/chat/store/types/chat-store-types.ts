
export type ChatPosition = 'bottom-right' | 'bottom-left' | { x: number, y: number };

export type SelectedMode = 'chat' | 'dev' | 'image' | 'training';

export type ChatMode = 'chat' | 'chat-only' | 'dev' | 'image' | 'training';

export interface TokenControl {
  balance: number;
  enforcementMode: 'always' | 'never' | 'role_based' | 'mode_based';
  lastUpdated: string | null;
  tokensPerQuery: number;
  freeQueryLimit: number;
  queriesUsed: number;
}

export interface ChatProvider {
  id: string;
  name: string;
  description: string;
  models: string[];
  supportsStreaming: boolean;
  icon?: string;
  category: 'chat' | 'image' | 'vector' | 'voice' | 'other';
  costPerToken?: number;
  isDefault?: boolean;
}

export type ProviderCategory = ChatProvider;

export interface UI {
  sessionLoading: boolean;
  messageLoading: boolean;
  providerLoading: boolean;
}

export interface ProvidersState {
  availableProviders: ProviderCategory[];
}

export interface MessageActions {
  addMessage: (message: any) => void;
  updateMessage: (id: string, updates: any) => void;
  resetChatState: () => void;
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
  
  // Mode actions
  setCurrentMode: (mode: ChatMode) => void;
  
  // Provider actions
  updateCurrentProvider: (provider: ProviderCategory) => void;
  updateAvailableProviders: (providers: ProviderCategory[]) => void;
  updateChatProvider: (providers: ProviderCategory[]) => void;
  
  // Feature actions
  toggleFeature: (featureName: keyof ChatState['features']) => void;
  enableFeature: (featureName: keyof ChatState['features']) => void;
  disableFeature: (featureName: keyof ChatState['features']) => void;
  setFeatureState: (featureName: keyof ChatState['features'], isEnabled: boolean) => void;
  
  // Token actions
  setTokenEnforcementMode: (mode: TokenControl['enforcementMode']) => void;
  addTokens: (amount: number) => Promise<boolean>;
  spendTokens: (amount: number) => Promise<boolean>;
  setTokenBalance: (amount: number) => Promise<boolean>;
}
