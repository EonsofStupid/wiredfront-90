
import { ChatMessage } from "@/types/chat";

export interface ChatProvider {
  id: string;
  name: string;
  type: string;
  isDefault: boolean;
}

export type ChatPosition = 'bottom-right' | 'bottom-left' | 'top-right' | 'top-left';

export interface ChatState {
  initialized: boolean;
  messages: ChatMessage[];
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
    // Add the missing feature flags that components expect
    codeAssistant: boolean;
    ragSupport: boolean;
    githubSync: boolean;
  };
  currentMode: 'chat' | 'dev' | 'image';
  availableProviders: ChatProvider[];
  currentProvider: ChatProvider | null;
  
  // Add missing UI state properties
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
  setCurrentMode: (mode: 'chat' | 'dev' | 'image') => void;
}
