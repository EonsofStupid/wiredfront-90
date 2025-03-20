
export type ChatMode = 'chat' | 'code' | 'doc' | 'agent';
export type ChatPosition = 'bottom-right' | 'bottom-left';

export interface ChatMessage {
  id: string;
  content: string;
  role: 'user' | 'assistant' | 'system';
  createdAt: string;
  sessionId: string;
  metadata?: Record<string, any>;
}

export interface ChatSession {
  id: string;
  title: string;
  mode: ChatMode;
  createdAt: string;
  updatedAt: string;
  userId: string;
  messages: ChatMessage[];
  metadata?: Record<string, any>;
}

export interface ChatProvider {
  id: string;
  name: string;
  description: string;
  supportedModes: ChatMode[];
  isEnabled: boolean;
  metadata?: Record<string, any>;
}

export interface ChatState {
  // UI State
  isOpen: boolean;
  isMinimized: boolean;
  showSidebar: boolean;
  scale: number;
  docked: boolean;
  position: ChatPosition;

  // Session State
  currentSessionId: string | null;
  currentMode: ChatMode;
  currentProvider: ChatProvider | null;
  availableProviders: ChatProvider[];

  // Loading States
  isInitialized: boolean;
  isLoading: boolean;
  error: string | null;
}

export interface ChatStore extends ChatState {
  // UI Actions
  toggleChat: () => void;
  toggleMinimize: () => void;
  toggleSidebar: () => void;
  setScale: (scale: number) => void;
  setDocked: (docked: boolean) => void;
  setPosition: (position: ChatPosition) => void;

  // Session Actions
  setCurrentSession: (sessionId: string) => void;
  setCurrentMode: (mode: ChatMode) => void;
  setCurrentProvider: (provider: ChatProvider) => void;
  updateAvailableProviders: (providers: ChatProvider[]) => void;

  // State Management
  initialize: () => Promise<void>;
  reset: () => void;
  setError: (error: string | null) => void;
}
