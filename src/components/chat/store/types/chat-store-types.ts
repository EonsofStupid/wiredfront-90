
export type ChatPosition = 'bottom-right' | 'bottom-left' | { x: number, y: number };

export type SelectedMode = 'chat' | 'dev' | 'image' | 'training';

export type ChatMode = 'chat' | 'chat-only' | 'dev' | 'image' | 'training';

// Define a concrete provider category type
export type ProviderCategoryType = 'chat' | 'image' | 'vector' | 'voice' | 'other';

// Define provider type
export type ProviderType = 
  | 'openai' 
  | 'anthropic' 
  | 'gemini' 
  | 'github' 
  | 'huggingface' 
  | 'pinecone' 
  | 'weaviate' 
  | 'openrouter' 
  | 'replicate' 
  | 'stabilityai' 
  | 'sonnet' 
  | 'elevenlabs' 
  | 'whisper'
  | string;

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
  category: ProviderCategoryType;
  costPerToken?: number;
  isDefault?: boolean;
  isEnabled?: boolean;
  type?: ProviderType;
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

// Define a clear FeatureState interface to simplify type safety
export interface FeatureState {
  voice: boolean;
  rag: boolean;
  modeSwitch: boolean;
  notifications: boolean;
  github: boolean;
  codeAssistant: boolean;
  ragSupport: boolean;
  githubSync: boolean;
  tokenEnforcement: boolean;
}

// Updated ChatState interface with proper feature state management
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
  features: FeatureState;
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
  toggleFeature: (featureName: keyof FeatureState) => void;
  enableFeature: (featureName: keyof FeatureState) => void;
  disableFeature: (featureName: keyof FeatureState) => void;
  setFeatureState: (featureName: keyof FeatureState, isEnabled: boolean) => void;
  
  // Token actions
  setTokenEnforcementMode: (mode: TokenControl['enforcementMode']) => void;
  addTokens: (amount: number) => Promise<boolean>;
  spendTokens: (amount: number) => Promise<boolean>;
  setTokenBalance: (amount: number) => Promise<boolean>;
}
