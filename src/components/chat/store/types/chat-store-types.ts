
import { Provider } from '@/components/chat/types/provider-types';
import { FeatureFlags } from '@/components/chat/types/feature-types';
import { ChatMode, ChatPositionType } from '@/components/chat/types/chat-modes';
import { Json } from '@/integrations/supabase/types';

/**
 * Main Chat State interface
 * This represents the global state for the chat component
 */
export interface ChatState {
  // UI state
  isOpen: boolean;
  isMinimized: boolean;
  showSidebar: boolean;
  position: ChatPositionType;
  scale: number;
  docked: boolean;
  
  // Chat state
  currentMode: ChatMode;
  messages: any[];
  userInput: string;
  isWaitingForResponse: boolean;
  chatId: string | null;
  startTime: number | null;
  
  // Feature flags
  features: FeatureFlags;
  
  // Provider state
  currentProvider: Provider | null;
  availableProviders: Provider[];
  selectedModel: string;
  providers: {
    availableProviders: Provider[];
    currentProvider: Provider | null;
  };
  
  // Token state
  tokenBalance: number;
  
  // Session state
  sessions: {
    allSessions: any[];
    currentSession: any | null;
    isLoading: boolean;
  };
  
  // Actions
  toggleChat: () => void;
  toggleMinimize: () => void;
  toggleSidebar: () => void;
  togglePosition: () => void;
  toggleMode: () => void;
  toggleDocked: () => void;
  
  setPosition: (position: ChatPositionType) => void;
  setUserInput: (input: string) => void;
  setMode: (mode: string | ChatMode) => void;
  setDocked: (docked: boolean) => void;
  setSessionLoading: (isLoading: boolean) => void;
  
  // Feature actions
  toggleFeature: (key: string) => void;
  enableFeature: (key: string) => void;
  disableFeature: (key: string) => void;
  setFeatureState: (key: string, enabled: boolean) => void;
  
  // Provider actions
  updateProviders: (providers: Provider[]) => void;
  updateChatProvider: (provider: Provider) => void;
  
  // Model actions
  setModel: (model: string) => void;
  
  // Token actions
  setTokenBalance: (balance: number) => void;
  
  // Lifecycle actions
  initializeChat: () => void;
}

// Define types for state management functions
export type SetState<T> = (
  partial: T | Partial<T> | ((state: T) => T | Partial<T>),
  replace?: boolean,
  action?: string | { type: string; [key: string]: any }
) => void;

export type GetState<T> = () => T;

// Re-export Provider type for convenience
export type { Provider, ChatProvider } from '@/components/chat/types/provider-types';
