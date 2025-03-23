import {
  ChatMode,
  TokenEnforcementMode,
} from "@/integrations/supabase/types/enums";

export type MessageRole = "user" | "assistant" | "system";

export type MessageStatus = "pending" | "sent" | "failed" | "error" | "cached";

export interface ChatMessage {
  id: string;
  content: string;
  role: MessageRole;
  status?: MessageStatus;
  timestamp?: string;
  sessionId?: string;
}

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

export interface TokenControl {
  balance: number;
  enforcementMode: TokenEnforcementMode;
  lastUpdated: string | null;
  freeQueryLimit: number;
  queriesUsed: number;
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

export interface ChatState {
  messages: ChatMessage[];
  userInput: string;
  isWaitingForResponse: boolean;
  selectedModel: string;
  selectedMode: string;
  modelFetchStatus: "idle" | "loading" | "success" | "error";
  error: string | null;
  chatId: string | null;
  isOpen: boolean;
  isHidden: boolean;
  docked: boolean;
  position: ChatPosition;
  loading: boolean;
  features: ChatFeatures;
  tokenControl: TokenControl;
  providers?: {
    availableProviders: ChatProvider[];
  };
  isMinimized: boolean;
  showSidebar: boolean;
  scale: number;
  ui: ChatUI;
  startTime?: string;
  currentMode?: ChatMode;
  currentProvider?: ChatProvider;
  x?: number;
  y?: number;
  toggleDocked?: () => void;
  setUserInput?: (input: string) => void;
  toggleFeature?: (feature: keyof ChatFeatures) => void;
  setCurrentMode?: (mode: ChatMode) => void;
  setScale?: (scale: number) => void;
  resetChatState?: () => void;
}

// Props types for components
export interface MessageProps {
  content: string;
  role: MessageRole;
  status?: MessageStatus;
  id?: string;
  timestamp?: string;
  onRetry?: (id: string) => void;
}

export interface ChatContainerProps {
  scrollRef: React.RefObject<HTMLDivElement>;
  isEditorPage: boolean;
}
