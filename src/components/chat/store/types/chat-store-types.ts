
import { ChatProviderType } from '@/types/admin/settings/chat-provider';

export type ChatPosition = 'bottom-right' | 'bottom-left';

export interface Message {
  id: string;
  content: string;
  role: 'user' | 'assistant' | 'system';
  timestamp?: string;
  status?: 'pending' | 'sent' | 'failed' | 'loading';
}

export interface LoadingState {
  isLoading: boolean;
  isError: boolean;
  errorMessage?: string;
}

export interface ChatFeatures {
  codeAssistant: boolean;
  ragSupport: boolean;
  githubSync: boolean;
  notifications: boolean;
  imageGeneration: boolean;
  integrations: boolean;
}

export interface ChatProvider {
  id: string;
  type: ChatProviderType;
  name: string;
  isEnabled: boolean;
  category?: 'chat' | 'image' | 'integration';
}

export interface ChatState {
  position: ChatPosition;
  isMinimized: boolean;
  showSidebar: boolean;
  isOpen: boolean;
  scale: number;
  docked: boolean;
  isInitialized: boolean;
  messages: Message[];
  startTime: number | null;
  features: ChatFeatures;
  providers: {
    currentProvider: ChatProviderType;
    availableProviders: ChatProvider[];
  };
  ui: {
    messageLoading: boolean;
    sessionLoading: boolean;
    providerSwitching: boolean;
  };
}

export interface ChatActions {
  togglePosition: () => void;
  toggleMinimize: () => void;
  toggleSidebar: () => void;
  toggleChat: () => void;
  setScale: (scale: number) => void;
  toggleDocked: () => void;
  toggleFeature: (feature: keyof ChatFeatures) => void;
  setCurrentProvider: (providerId: string) => void;
  toggleProviderEnabled: (providerId: string) => void;
  initializeChatSettings: () => void;
  setMessageLoading: (isLoading: boolean) => void;
  setSessionLoading: (isLoading: boolean) => void;
  setProviderSwitching: (isSwitching: boolean) => void;
}
