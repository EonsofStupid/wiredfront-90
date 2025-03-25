import { ChatMode, Message } from "@/types/chat";
import { ProviderCategory } from "@/types/providers";
import { ChatSettings } from "@/utils/storage/chat-settings";

export type ChatPosition =
  | "bottom-right"
  | "bottom-left"
  | "top-right"
  | "top-left";

export type MessageActions = {
  copy: boolean;
  edit: boolean;
  delete: boolean;
};

export type ProviderType =
  | "openai"
  | "anthropic"
  | "gemini"
  | "huggingface"
  | "pinecone"
  | "weaviate"
  | "openrouter"
  | "github"
  | "replicate"
  | "stabilityai"
  | "vector"
  | "voice"
  | "dalle"
  | "perplexity"
  | "qdrant"
  | "elevenlabs"
  | "whisper"
  | "sonnet";

export type ProviderCategoryType =
  | "chat"
  | "image"
  | "other"
  | "vector"
  | "voice";

export type SidebarState = {
  isOpen: boolean;
  width: number;
  items: SidebarItem[];
};

export type SidebarItem = {
  id: string;
  label: string;
  icon?: string;
  type: "session" | "setting" | "feature";
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
  mode: "NONE" | "ENFORCE" | "WARN";
  balance: number;
  queriesUsed: number;
  enforcementMode: "NONE" | "ENFORCE" | "WARN";
  tokenEnforcement?: boolean;
}

export interface Providers {
  loading: boolean;
  error?: string | null;
  availableProviders: ProviderCategory[];
}

export interface UIState {
  sessionLoading: boolean;
  messageLoading: boolean;
  providerLoading: boolean;
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
  modelFetchStatus: "idle" | "loading" | "success" | "error";
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
  setTokenEnforcementMode: (mode: TokenControl["mode"]) => void;
  addTokens: (amount: number) => Promise<boolean>;
  spendTokens: (amount: number) => Promise<boolean>;
  setTokenBalance: (amount: number) => Promise<boolean>;
  initializeChatSettings: () => void;
  setSessionLoading: (isLoading: boolean) => void;
  // UI Actions
  updateCurrentProvider: (provider: ChatProvider) => void;
  updateAvailableProviders: (providers: ChatProvider[]) => void;
}

export type ChatProvider = {
  id: string;
  name: string;
  type: string;
  isActive: boolean;
  description?: string;
  category: ProviderCategory;
  isDefault?: boolean;
};
