
import { Message } from '@/components/chat/shared/schemas/messages';
import { ChatProvider } from '@/components/chat/shared/types/chat-provider';

export type ConnectionState = 'disconnected' | 'connecting' | 'connected' | 'error';

export interface ChatPosition {
  x?: number;
  y?: number;
  position?: 'bottom-right' | 'bottom-left' | 'top-right' | 'top-left';
}

export interface ChatState {
  // UI state
  isOpen: boolean;
  isMinimized: boolean;
  position: ChatPosition;
  docked: boolean;
  scale: number;
  showSidebar: boolean;
  
  // Chat state
  chatId: string | null;
  userInput: string;
  isWaitingForResponse: boolean;
  isInitialized: boolean;
  connectionState: ConnectionState;
  
  // Current mode for context-aware chat
  currentMode?: string;
  
  // UI state object for components to consume
  ui: {
    sessionLoading: boolean;
    messageLoading: boolean;
    providerLoading: boolean;
    isChatLoaded: boolean;
    isChatInitialized: boolean;
  };
  
  // Action creators
  setUserInput: (input: string) => void;
  toggleChat: () => void;
  toggleMinimize: () => void;
  toggleSidebar: () => void;
  setPosition: (position: ChatPosition) => void;
  toggleDock: () => void;
  setScale: (scale: number) => void;
  setChatId: (id: string | null) => void;
  toggleUIState: (key: keyof ChatState, value?: boolean) => void;
  
  // Feature flags and UI state
  features: {
    voiceEnabled: boolean;
    imageGenEnabled: boolean;
    githubEnabled: boolean;
    codeCompletionEnabled: boolean;
    ragEnabled: boolean;
    tokenEnforcement: boolean;
  };
  
  // Toggle feature flags
  toggleFeature: (featureName: keyof ChatState['features']) => void;

  // Provider state
  availableProviders: ChatProvider[];
  currentProvider: ChatProvider | null;
  providers: {
    availableProviders: ChatProvider[];
  };

  // Token control
  tokenControl: {
    balance: number;
    enforcementMode: 'never' | 'always' | 'when_available';
    lastUpdated: Date | null;
    tokensPerQuery: number;
    freeQueryLimit: number;
    queriesUsed: number;
  };
  
  // Custom UI properties
  neonEnabled?: boolean;
  glassEnabled?: boolean;
}

// Export these for use in the store
export { type ChatProvider };
