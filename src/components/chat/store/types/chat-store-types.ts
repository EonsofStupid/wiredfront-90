
import { Message } from "@/types/chat";

export type ChatMode = 'chat' | 'dev' | 'image' | 'training';

export interface ChatProvider {
  id: string;
  name: string;
  type: string;
  isDefault: boolean;
  isEnabled?: boolean;
  category?: 'chat' | 'image' | 'integration';
}

export type ChatPosition = 'bottom-right' | 'bottom-left' | 'top-right' | 'top-left';

export interface TokenUsage {
  available: number;
  used: number;
  lastRefilled: string; // ISO date string
}

export interface ChatSession {
  id: string;
  mode: ChatMode;
  title?: string;
  projectId?: string;
  githubRepo?: string;
  lastSyncedCommit?: string;
  tokensUsed: number;
  createdAt: string;
  updatedAt: string;
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
  };
  currentMode: ChatMode;
  availableProviders: ChatProvider[];
  currentProvider: ChatProvider | null;
  
  // Add session management properties
  currentSession: ChatSession | null;
  sessions: Record<string, ChatSession>;
  
  // Add token management
  tokenUsage: TokenUsage;
  
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
