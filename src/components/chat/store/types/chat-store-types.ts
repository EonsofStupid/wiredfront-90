
import { ChatMode } from '@/components/chat/types/chat-modes';
import { FeatureFlags, Provider } from '@/components/chat/types';
import { Json } from '@/integrations/supabase/types';

/**
 * Chat state definition
 */
export interface ChatState {
  // Core state
  initialized: boolean;
  messages: any[];
  userInput: string;
  isWaitingForResponse: boolean;
  selectedModel: string;
  selectedMode: string;
  modelFetchStatus: 'idle' | 'loading' | 'error' | 'success';
  error: string | null;
  chatId: string | null;
  
  // UI state
  docked: boolean;
  isOpen: boolean;
  isMinimized: boolean;
  position: string | {x: number, y: number};
  startTime: number;
  
  // Feature flags
  features: FeatureFlags;
  
  // Mode and provider state
  currentMode: ChatMode;
  availableProviders: Provider[];
  currentProvider: Provider | null;
  
  providers: {
    availableProviders: any[];
  };
  
  // UI state continued
  showSidebar: boolean;
  scale: number;
  ui: {
    sessionLoading: boolean;
    messageLoading: boolean;
    providerLoading: boolean;
  };
  
  // Required actions (initialized in the store)
  resetChatState: () => void;
  setUserInput: (input: string) => void;
  toggleChat: () => void;
  toggleMinimize: () => void;
  toggleSidebar: () => void;
  toggleDocked: () => void;
  setPosition: (position: any) => void;
  setChatId: (id: string | null) => void;
  setMode: (mode: string | ChatMode) => void;
  initializeChat: () => void;
  setSessionLoading: (isLoading: boolean) => void; 
  setMessageLoading: (isLoading: boolean) => void;
  setProviderLoading: (isLoading: boolean) => void;
}

// Types for state management functions
export type SetState<T> = (
  partial: T | Partial<T> | ((state: T) => T | Partial<T>),
  replace?: boolean,
  action?: string | { type: string; [key: string]: any }
) => void;

export type GetState<T> = () => T;
