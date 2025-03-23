import { Json } from "@/integrations/supabase/types";
import { TokenEnforcementMode } from "@/integrations/supabase/types/enums";

export type MessageStatus = "pending" | "sent" | "failed" | "error" | "cached";
export type MessageRole = "user" | "assistant" | "system";

export interface Message {
  id: string;
  content: string;
  user_id: string | null;
  type: "text" | "command" | "system";
  metadata: Json;
  created_at: string;
  updated_at: string;
  chat_session_id: string;
  is_minimized: boolean;
  position: Json;
  window_state: Json;
  last_accessed: string;
  retry_count: number;
  message_status: MessageStatus;
  role: MessageRole;
  source_type?: string;
  provider?: string;
  processing_status?: string;
  last_retry?: string;
  rate_limit_window?: string;
}

export type ChatMode = "chat" | "dev" | "image" | "training";
export type ChatPosition =
  | "bottom-right"
  | "bottom-left"
  | "top-right"
  | "top-left";

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

export interface TokenControl {
  balance: number;
  enforcementMode: TokenEnforcementMode;
  lastUpdated: number | null;
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
  selectedMode: ChatMode;
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
  tokenControl: TokenControl;
  providers: {
    availableProviders: ChatProvider[];
  };
  isMinimized: boolean;
  showSidebar: boolean;
  scale: number;
  ui: ChatUI;

  // Store actions
  resetChatState: () => void;
  setUserInput: (input: string) => void;
  setChatId: (id: string | null) => void;
  setIsWaitingForResponse: (waiting: boolean) => void;
  setCurrentMode: (mode: ChatMode) => void;
  setPosition: (position: ChatPosition) => void;
  setIsMinimized: (minimized: boolean) => void;
  setShowSidebar: (show: boolean) => void;
  toggleChat: () => void;
  minimizeChat: () => void;
  maximizeChat: () => void;
  closeChat: () => void;
  openChat: () => void;
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
