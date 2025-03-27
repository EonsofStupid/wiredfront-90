
import { ChatMode, ChatPositionType } from '@/types/chat/enums';
import { Message } from '@/types/chat/message';

export interface ChatState {
  // UI State
  isOpen: boolean;
  isMinimized: boolean;
  showSidebar: boolean;
  position: ChatPositionType;
  docked: boolean;
  scale: number;
  
  // Session State
  userInput: string;
  messages: Message[];
  chatId: string | null;
  isWaitingForResponse: boolean;
  mode: ChatMode;
  startTime: number | null;
  
  // Feature Toggles
  features: {
    githubSync: boolean;
    knowledgeBase: boolean;
    notifications: boolean;
    voice: boolean;
  };
  
  // Provider State
  currentProvider: {
    id: string;
    name: string;
    maxTokens: number;
  } | null;
  
  // UI Loading States
  ui: {
    sessionLoading: boolean;
    messageLoading: boolean;
    providerLoading: boolean;
  };
  
  // Actions
  toggleChat: () => void;
  toggleMinimize: () => void;
  toggleSidebar: () => void;
  toggleDocked: () => void;
  setPosition: (position: ChatPositionType) => void;
  setUserInput: (input: string) => void;
  setChatId: (id: string | null) => void;
  setMode: (mode: ChatMode) => void;
  initializeChat: () => void;
  setSessionLoading: (loading: boolean) => void;
  setMessageLoading: (loading: boolean) => void;
  setProviderLoading: (loading: boolean) => void;
}
