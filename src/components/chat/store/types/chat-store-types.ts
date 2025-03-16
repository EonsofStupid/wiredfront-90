
import { Message } from "@/types/chat";
import { ChatMode, TokenEnforcementMode } from "@/integrations/supabase/types/enums";

export type ProviderCategory = 'chat' | 'image' | 'mixed' | 'integration';

export interface ChatProvider {
  id: string;
  name: string;
  type: string;
  isDefault: boolean;
  isEnabled?: boolean;
  category?: ProviderCategory;
  models?: string[];
  features?: string[];
}

export type ChatPosition = 'bottom-right' | 'bottom-left' | 'top-right' | 'top-left';

export interface TokenControl {
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
  error: string | null;
  chatId: string | null;
  docked: boolean;
  isOpen: boolean;
  isHidden: boolean;
  position: ChatPosition | { x: number; y: number };
  startTime: number;
  features: {
    voice: boolean;
    rag: boolean;
    modeSwitch: boolean;
    notifications: boolean;
    github: boolean;
    // Feature flags that components expect
    codeAssistant: boolean;
    ragSupport: boolean;
    githubSync: boolean;
    tokenEnforcement: boolean;
  };
  currentMode: ChatMode;
  availableProviders: ChatProvider[];
  currentProvider: ChatProvider | null;
  
  // Token control system
  tokenControl: TokenControl;
  
  // Add providers mapping for session management
  providers?: {
    availableProviders: ChatProvider[];
  };
  
  // UI state properties
  isMinimized: boolean;
  showSidebar: boolean;
  scale: number;
  ui: {
    sessionLoading: boolean;
    messageLoading: boolean;
    providerLoading: boolean;
  };

  // Store actions
  resetChatState: () => void;
  
  // Add setUserInput to the ChatState interface
  setUserInput: (input: string) => void;
}

export interface UIStateActions {
  toggleMinimize: () => void;
  toggleSidebar: () => void;
  toggleChat: () => void;
  setSessionLoading: (isLoading: boolean) => void;
  setMessageLoading: (isLoading: boolean) => void;
  setProviderLoading: (isLoading: boolean) => void;
  setScale: (scale: number) => void;
  setCurrentMode: (mode: ChatMode) => void;
}

// Define message management actions
export interface MessageActions {
  addMessage: (message: Message) => void;
  updateMessage: (id: string, updates: Partial<Message>) => void;
}

// Reusable type definitions for state management
export type SetState<T> = (
  partial: T | Partial<T> | ((state: T) => T | Partial<T>),
  replace?: boolean,
  action?: { type: string; [key: string]: any }
) => void;

export type GetState<T> = () => T;
