
import { Provider } from '@/components/chat/types/provider-types';
import { ChatMode, ChatPosition, MessageRole, MessageStatus, MessageType } from '@/types/chat/enums';
import { Conversation } from '@/components/chat/types/conversation-types';
import { Message } from '@/components/chat/types/message-types';

// Provider type for the chat store
export interface ChatProvider extends Provider {
  id: string;
  name: string;
  type: string;
  description?: string;
  isDefault?: boolean;
  isAvailable?: boolean;
  models?: string[];
  capabilities?: string[];
  icon?: string;
  metadata?: Record<string, any>;
}

// Chat session type
export interface ChatSession {
  id: string;
  title: string;
  created: string;
  updated: string;
  messages: Message[];
}

// Chat window state
export interface ChatWindowState {
  width: number;
  height: number;
  position: ChatPosition;
  isMinimized: boolean;
  isOpen: boolean;
  showSidebar: boolean;
  scale: number;
}

// Base feature flags
export interface FeatureFlags {
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
}

// Chat store state interface
export interface ChatState {
  // Window state
  isOpen: boolean;
  isMinimized: boolean;
  position: ChatPosition;
  scale: number;
  showSidebar: boolean;
  
  // Session state
  chatId: string | null;
  currentMode: ChatMode;
  selectedModel: string | null;
  
  // Features
  features: FeatureFlags;
  
  // Providers
  providers: {
    availableProviders: ChatProvider[];
    currentProvider: ChatProvider | null;
  };
  currentProvider: ChatProvider | null;
  availableProviders: ChatProvider[];
  
  // Status
  isLoading: boolean;
  isSessionLoading: boolean;
  error: Error | null;
  
  // Tokens
  tokenBalance: number | null;
  
  // Actions
  toggleChat: () => void;
  toggleMinimize: () => void;
  toggleSidebar: () => void;
  setScale: (scale: number) => void;
  setChatId: (id: string | null) => void;
  setMode: (mode: ChatMode | string) => void;
  togglePosition: () => void;
  setPosition: (position: ChatPosition) => void;
  initializeChat: () => void;
  setIsLoading: (isLoading: boolean) => void;
  setSessionLoading: (isLoading: boolean) => void;
  setError: (error: Error | null) => void;
  resetChatState: () => void;
  toggleFeature: (feature: keyof FeatureFlags) => void;
  enableFeature: (feature: keyof FeatureFlags) => void;
  disableFeature: (feature: keyof FeatureFlags) => void;
  setFeatureState: (feature: keyof FeatureFlags, enabled: boolean) => void;
  
  // Token actions
  setTokenBalance: (balance: number) => void;
  addTokens: (amount: number) => number;
  deductTokens: (amount: number) => number;
}
