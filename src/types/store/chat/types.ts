import { TokenEnforcementMode } from '@/integrations/supabase/types/enums';
import { Message } from '@/types/chat';
import { ConnectionState } from '@/types/websocket';

export interface ChatSession {
  id: string;
  messages: Message[];
  isMinimized: boolean;
  position: { x: number; y: number };
  isTacked: boolean;
  lastAccessed: Date;
}

export interface ChatPreferences {
  messageBehavior: 'enter_send';
  notifications: boolean;
  soundEnabled: boolean;
  typingIndicators: boolean;
}

export interface ChatStore {
  sessions: Record<string, ChatSession>;
  currentSessionId: string | null;
  connectionState: ConnectionState;
  preferences: ChatPreferences;
  isInitialized: boolean;
  initialize: () => void;
  createSession: () => string;
  switchSession: (sessionId: string) => void;
  updateSession: (sessionId: string, updates: Partial<ChatSession>) => void;
  addMessage: (sessionId: string, message: any) => void;
  updatePreferences: (updates: Partial<ChatPreferences>) => void;
  setConnectionState: (state: ConnectionState) => void;
  removeSession: (sessionId: string) => void;
}

export type ChatMode = 'chat' | 'code' | 'assistant';

export interface ProviderCategory {
  id: string;
  name: string;
  description?: string;
  models: string[];
  isEnabled: boolean;
}

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
  startMinimized: boolean;
  showTimestamps: boolean;
  saveHistory: boolean;
}

export interface TokenControl {
  balance: number;
  enforcementMode: TokenEnforcementMode;
  lastUpdated: string | null;
  tokensPerQuery: number;
  freeQueryLimit: number;
  queriesUsed: number;
}

export interface ProviderState {
  availableProviders: ProviderCategory[];
  currentProvider: ProviderCategory | null;
  error: string | null;
}

export interface UIState {
  sessionLoading: boolean;
  messageLoading: boolean;
  providerLoading: boolean;
}

export interface ChatState {
  initialized: boolean;
  messages: Message[];
  userInput: string;
  isWaitingForResponse: boolean;
  selectedModel: string;
  selectedMode: ChatMode;
  modelFetchStatus: 'idle' | 'loading' | 'success' | 'error';
  error: string | null;
  chatId: string | null;
  docked: boolean;
  isOpen: boolean;
  isHidden: boolean;
  startTime: number;
  features: FeatureState;
  currentMode: ChatMode;
  availableProviders: ProviderCategory[];
  currentProvider: ProviderCategory | null;
  position: { x: number; y: number };
  tokenControl: TokenControl;
  providers: ProviderState;
  isMinimized: boolean;
  showSidebar: boolean;
  scale: number;
  ui: UIState;
  theme: string;
  uiPreferences: {
    messageBehavior: 'enter_send';
    notifications: boolean;
    soundEnabled: boolean;
    typingIndicators: boolean;
  };
}
