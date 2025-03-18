import { Message } from '@/types/chat';
import { TokenEnforcementMode } from '@/integrations/supabase/types/enums';
import { ChatSettings } from '@/utils/storage/chat-settings';

export type ChatMode = 'chat' | 'dev' | 'image' | 'training';

export type ChatPosition = {
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

export type ProviderCategory = {
  id: string;
  name: string;
  models: string[];
  type: ProviderType;
  enabled: boolean;
  icon?: string;
  description?: string;
  supportsStreaming?: boolean;
  costPerToken?: number;
  category: ProviderCategoryType;
  isDefault?: boolean;
  isEnabled?: boolean;
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
  isOpen: boolean;
  isMinimized: boolean;
  position: 'bottom-right' | 'bottom-left';
  currentMode: ChatMode;
  features: {
    voice: boolean;
    rag: boolean;
    modeSwitch: boolean;
    github: boolean;
  };
  settings: ChatSettings;
}

export interface TokenControlState {
  balance: number;
  enforcementMode: TokenEnforcementMode;
  lastUpdated: string | null;
  tokensPerQuery: number;
  freeQueryLimit: number;
  queriesUsed: number;
}

export interface ChatState extends UIState {
  // Action placeholders
  toggleChat: () => void;
  toggleMinimize: () => void;
  togglePosition: () => void;
  setCurrentMode: (mode: ChatMode) => void;
  toggleFeature: (feature: keyof UIState['features']) => void;
  updateSettings: (newSettings: Partial<ChatSettings>) => void;
  resetSettings: () => void;
}
