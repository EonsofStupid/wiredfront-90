
import {
  ChatMode,
  TokenEnforcementMode,
} from "@/integrations/supabase/types/enums";
import { Message } from "@/types/chat";

// Re-export Message type as ChatMessage
export type ChatMessage = Message;

export interface ChatFeatures {
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

export interface ChatUI {
  sessionLoading: boolean;
  messageLoading: boolean;
  providerLoading: boolean;
}

export interface ChatProvider {
  id: string;
  name: string;
  type: string;
  isDefault: boolean;
  isEnabled?: boolean;
  category?: "chat" | "image" | "integration";
}

export type ChatPosition =
  | "bottom-right"
  | "bottom-left"
  | "top-right"
  | "top-left";

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
  messages: ChatMessage[];
  userInput: string;
  isWaitingForResponse: boolean;
  selectedModel: string;
  selectedMode: string;
  modelFetchStatus: "idle" | "loading" | "success" | "error";
  error: string | null;
  chatId: string | null;
  docked: boolean;
  isOpen: boolean;
  isHidden: boolean;
  position: ChatPosition | { x: number; y: number };
  startTime: number;
  features: ChatFeatures;
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
  ui: ChatUI;

  // UI actions
  togglePosition: () => void;
  toggleDocked: () => void;
  setIsHidden: (hidden: boolean) => void;
  toggleMinimize: () => void;
  toggleSidebar: () => void;
  toggleChat: () => void;
  setSessionLoading: (isLoading: boolean) => void;
  setMessageLoading: (isLoading: boolean) => void;
  setProviderLoading: (isLoading: boolean) => void;
  setScale: (scale: number) => void;
  setCurrentMode: (mode: ChatMode) => void;
  setUserInput: (input: string) => void;

  // Provider management actions
  updateCurrentProvider: (provider: ChatProvider) => void;
  updateAvailableProviders: (providers: ChatProvider[]) => void;

  // Token management actions
  addTokens: (amount: number) => void;
  spendTokens: (amount: number) => void;
  setTokenBalance: (balance: number) => void;
  setTokenEnforcementMode: (mode: TokenEnforcementMode) => void;
  
  // Store actions
  resetChatState: () => void;
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
  setUserInput: (input: string) => void;
}
