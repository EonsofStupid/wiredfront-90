import { Message } from '@/components/chat/shared/schemas/messages';

export interface ChatPosition {
  x?: number;
  y?: number;
  position?: 'bottom-right' | 'bottom-left' | 'top-right' | 'top-left';
}

export interface ConnectionState {
  status: 'connected' | 'disconnected' | 'connecting' | 'error';
  lastPing?: number;
  error?: Error | null;
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
  
  // UI state object for components to consume
  ui: {
    sessionLoading: boolean;
    messageLoading: boolean;
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
  };
  
  // Toggle feature flags
  toggleFeature: (featureName: keyof ChatState['features']) => void;
}
