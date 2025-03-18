import { Message } from '@/types/chat';
import { TokenEnforcementMode } from '@/integrations/supabase/types/enums';

export type ChatMode = 'chat' | 'dev' | 'image' | 'training';
export type ChatPosition = 'bottom-right' | 'bottom-left' | { x: number; y: number };
export type ProviderType = 'openai' | 'anthropic' | 'gemini' | 'huggingface' | 'pinecone' | 
                         'weaviate' | 'qdrant' | 'github' | 'stabilityai' | 'replicate' | 
                         'elevenlabs' | 'whisper' | 'other';
export type ProviderCategoryType = 'chat' | 'image' | 'vector' | 'voice' | 'other';

export type SidebarState = {
  isOpen: boolean;
  width: number;
  items: SidebarItem[];
};

export type SidebarItem = {
  id: string;
  label: string;
  icon?: string;
  type: 'session' | 'setting' | 'feature';
};

export type ProviderCategory = {
  id: string;
  name: string;
  models: string[];
  type: string;
  enabled: boolean;
  icon?: string;
  description?: string;
  isDefault?: boolean;
  isEnabled?: boolean;
  category?: ProviderCategoryType;
  supportsStreaming?: boolean;
  costPerToken?: number;
};

export type ChatProvider = ProviderCategory;

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

export interface ProviderState {
  availableProviders: ProviderCategory[];
}

export interface UIState {
  sessionLoading: boolean;
  messageLoading: boolean;
  providerLoading: boolean;
}

export interface TokenControlState {
  balance: number;
  enforcementMode: TokenEnforcementMode;
  lastUpdated: string | null;
  tokensPerQuery: number;
  freeQueryLimit: number;
  queriesUsed: number;
}

export interface ChatState {
  initialized: boolean;
  messages: Message[];
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
  features: FeatureState;
  currentMode: ChatMode;
  availableProviders: ProviderCategory[];
  currentProvider: ProviderCategory | null;
  tokenControl: TokenControlState;
  providers: ProviderState;
  isMinimized: boolean;
  showSidebar: boolean;
  scale: number;
  ui: UIState;
  
  addMessage: (message: Message) => void;
  updateMessage: (id: string, updates: Partial<Message>) => void;
  resetChatState: () => void;
  setUserInput: (input: string) => void;
  togglePosition: () => void;
  toggleDocked: () => void;
  setScale: (scale: number) => void;
  toggleSidebar: () => void;
  
  setCurrentMode: (mode: ChatMode) => void;
  updateCurrentProvider: (provider: ProviderCategory) => void;
  updateAvailableProviders: (providers: ProviderCategory[]) => void;
  updateChatProvider: (providers: ProviderCategory[]) => void;
  toggleFeature: (feature: keyof FeatureState) => void;
  enableFeature: (feature: keyof FeatureState) => void;
  disableFeature: (feature: keyof FeatureState) => void;
  setFeatureState: (feature: keyof FeatureState, isEnabled: boolean) => void;
  setTokenEnforcementMode: (mode: TokenEnforcementMode) => void;
  addTokens: (amount: number) => Promise<boolean>;
  spendTokens: (amount: number) => Promise<boolean>;
  setTokenBalance: (amount: number) => Promise<boolean>;
}

export interface MessageActions {
  sendMessage: (content: string) => Promise<void>;
  retryMessage: (messageId: string) => Promise<void>;
  deleteMessage: (messageId: string) => void;
  clearMessages: () => void;
}
