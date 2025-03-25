import { Message } from '@/types/chat';
import { TokenEnforcementMode } from '@/integrations/supabase/types/enums';
import { ChatSettings } from '@/utils/storage/chat-settings';
import { ChatMode } from '@/components/chat/chatbridge/types';
import { ProviderCategory } from '@/types/providers';

export type ChatPosition = 'bottom-right' | 'bottom-left' | {
  x: number;
  y: number;
};

export type MessageActions = {
  copy: boolean;
  edit: boolean;
  delete: boolean;
};

export type ProviderType = 
  | 'openai' 
  | 'anthropic' 
  | 'gemini' 
  | 'huggingface' 
  | 'pinecone' 
  | 'weaviate' 
  | 'openrouter' 
  | 'github' 
  | 'replicate' 
  | 'stabilityai' 
  | 'vector' 
  | 'voice'
  | 'dalle'
  | 'perplexity'
  | 'qdrant'
  | 'elevenlabs'
  | 'whisper'
  | 'sonnet';

export type ProviderCategoryType = 'chat' | 'image' | 'other' | 'vector' | 'voice';

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

export interface TokenControl {
  mode: TokenEnforcementMode;
  balance: number;
  tokensPerQuery?: number;
  freeQueryLimit?: number;
  queriesUsed?: number;
  enforcementMode: TokenEnforcementMode;
}

export interface Providers {
  loading: boolean;
  error?: string | null;
}

export type ChatProvider = {
  id: string;
  name: string;
  type: string;
  models: string[];
  isDefault: boolean;
  isEnabled: boolean;
  apiKey?: string;
};

export interface UIState {
  sessionLoading: boolean;
  messageLoading: boolean;
}

export interface ChatState {
  initialized: boolean;
  isOpen: boolean;
  isMinimized: boolean;
  isHidden: boolean;
  position: ChatPosition;
  currentMode: ChatMode;
  features: FeatureState;
  settings: ChatSettings;
  docked: boolean;
  scale: number;
  showSidebar: boolean;
  messages: Message[];
  userInput: string;
  isWaitingForResponse: boolean;
  selectedModel: string;
  selectedMode: string;
  modelFetchStatus: 'idle' | 'loading' | 'success' | 'error';
  error?: string | null;
  chatId: string | null;
  startTime: number;
  availableProviders: ProviderCategory[];
  currentProvider: ProviderCategory | null;
  tokenControl: TokenControl;
  providers: Providers;
  ui: UIState;

  // Actions
  toggleChat: () => void;
  toggleMinimize: () => void;
  togglePosition: () => void;
  setCurrentMode: (mode: ChatMode) => void;
  toggleFeature: (feature: keyof FeatureState) => void;
  updateSettings: (newSettings: Partial<ChatSettings>) => void;
  resetSettings: () => void;
  toggleDocked: () => void;
  setScale: (scale: number) => void;
  setUserInput: (input: string) => void;
  addMessage: (message: Message) => void;
  updateMessage: (id: string, updates: Partial<Message>) => void;
  resetChatState: () => void;
  setAvailableProviders: (providers: ProviderCategory[]) => void;
  setCurrentProvider: (provider: ProviderCategory | null) => void;
  setTokenEnforcementMode: (mode: TokenControl['mode']) => Promise<boolean>;
  addTokens: (amount: number) => Promise<boolean>;
  spendTokens: (amount: number) => Promise<boolean>;
  setTokenBalance: (amount: number) => Promise<boolean>;
  
  // New methods
  setSessionLoading: (loading: boolean) => void;
  setMessageLoading: (loading: boolean) => void;
  initializeChatSettings: () => void;
  enableFeature: (feature: keyof FeatureState) => void;
  disableFeature: (feature: keyof FeatureState) => void;
  setFeatureState: (feature: keyof FeatureState, enabled: boolean) => void;
  updateCurrentProvider: (provider: ProviderCategory | null) => void;
  updateAvailableProviders: (providers: ProviderCategory[]) => void;
}
