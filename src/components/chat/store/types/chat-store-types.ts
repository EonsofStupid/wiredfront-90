
import { ChatMode, ChatPosition, MessageStatus } from '@/types/chat/enums';
import { Message } from '@/types/chat/message';
import { Conversation } from '@/types/chat/conversation';
import { Provider } from '@/components/chat/types/provider-types';

// UI Chat Mode representation
export type UiChatMode = 'standard' | 'editor' | 'image' | 'training' | 'planning' | 'code' | 'document' | 'audio';

// Re-export the Provider type
export type ChatProvider = Provider;

// Chat window state
export interface ChatWindowState {
  isMinimized: boolean;
  isVisible: boolean;
  height: number;
  width: number;
}

// Chat session state
export interface ChatSession {
  id: string | null;
  messages: Message[];
  startTime: number | null;
  mode: ChatMode;
}

// Chat state interface
export interface ChatState {
  // UI state
  isOpen: boolean;
  isMinimized: boolean;
  userInput: string;
  position: ChatPosition;
  error: string | null;
  docked: boolean;
  showSidebar: boolean;
  scale: number;
  
  // Session state
  messages: Message[];
  startTime: number | null;
  currentSession: string | null;
  sessions: Record<string, ChatSession>;
  chatId: string | null;
  isWaitingForResponse: boolean;
  
  // Provider state
  currentProvider: Provider | null;
  availableProviders: Provider[];
  providers: {
    currentProvider: Provider | null;
    availableProviders: Provider[];
  };
  
  // Selection state
  selectedModel: string;
  selectedMode: string;
  
  // UI status
  modelFetchStatus: 'idle' | 'loading' | 'success' | 'error';
  ui: {
    sessionLoading: boolean;
    messageLoading: boolean;
    providerLoading: boolean;
  };
  
  // Feature flags
  features: {
    voice: boolean;
    rag: boolean;
    darkMode: boolean;
    imageGeneration: boolean;
    multiFile: boolean;
    ragSupport: boolean;
    githubSync: boolean;
    knowledgeBase: boolean;
    tokenEnforcement: boolean;
    standardChat: boolean;
    training: boolean;
    codeAssistant: boolean;
    notifications: boolean;
    modeSwitch: boolean;
  };
  
  // Current modes
  currentMode: ChatMode;
  
  // Custom UI state
  customStyles: Record<string, string>;
  
  // Actions - these will be implemented by action creators
  resetChatState: () => void;
  setUserInput: (input: string) => void;
  toggleChat: () => void;
  toggleMinimize: () => void;
  toggleSidebar: () => void;
  toggleDocked: () => void;
  resetInput: () => void;
  setError: (error: string | null) => void;
  setCurrentSession: (sessionId: string | null) => void;
  setChatId: (id: string | null) => void;
  setMode: (mode: ChatMode | string) => void;
  setPosition: (position: ChatPosition) => void;
  initializeChat: () => void;
  setSessionLoading: (isLoading: boolean) => void;
  setMessageLoading: (isLoading: boolean) => void;
  setProviderLoading: (isLoading: boolean) => void;
}

// Define conversation store state
export interface ConversationState {
  conversations: Conversation[];
  currentConversationId: string | null;
  isLoading: boolean;
  error: Error | null;
  
  // Required actions
  fetchConversations: () => Promise<void>;
  createConversation: (params?: any) => string;
  updateConversation: (id: string, updates: any) => Promise<boolean>;
  archiveConversation: (id: string) => boolean;
  deleteConversation: (id: string) => boolean;
  setCurrentConversationId: (id: string | null) => void;
}
