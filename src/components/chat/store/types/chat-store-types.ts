
import { ChatPosition } from '@/types/chat/enums';
import { UiChatMode } from '@/components/chat/types/chat-modes';
import { Provider } from '@/types/chat/providers';

/**
 * Chat feature/capability toggle keys
 */
export enum FeatureKey {
  // UI features
  MINIMIZE = 'minimize',
  RESIZE = 'resize',
  DOCK = 'dock',
  CLOSE = 'close',
  SETTINGS = 'settings',
  
  // Functional features
  CODE_EXECUTION = 'codeExecution',
  IMAGE_GENERATION = 'imageGeneration',
  TRAINING_MODE = 'trainingMode', 
  OFFLINE_MODE = 'offlineMode',
  VOICE_INPUT = 'voiceInput',
  FILE_UPLOAD = 'fileUpload',
  
  // External integrations
  GITHUB_INTEGRATION = 'githubIntegration',
  DATABASE_ACCESS = 'databaseAccess',
  API_ACCESS = 'apiAccess'
}

/**
 * Chat UI state
 */
export interface ChatUIState {
  isOpen: boolean;
  isMinimized: boolean;
  isDocked: boolean;
  position: ChatPosition | { x: number; y: number };
  activeTab: string;
  messageLoading: boolean;
  error: string | null;
}

/**
 * Provider state
 */
export interface ProviderState {
  currentProvider: Provider | null;
  availableProviders: Provider[];
  isLoading: boolean;
  error: string | null;
}

/**
 * Base chat state
 */
export interface ChatState {
  // Core state
  currentMode: UiChatMode;
  tokenBalance: number;
  
  // Child states
  ui: ChatUIState;
  providers: ProviderState;
  features: Record<string, boolean>;
  
  // Actions will be added by middleware
}

/**
 * Actions for UI state management
 */
export interface ChatUIActions {
  toggleChat: () => void;
  toggleMinimize: () => void;
  toggleDocked: () => void;
  setPosition: (position: ChatPosition | { x: number; y: number }) => void;
  setActiveTab: (tab: string) => void;
  setError: (error: string | null) => void;
  setMessageLoading: (loading: boolean) => void;
}

/**
 * Actions for provider management
 */
export interface ProviderActions {
  setCurrentProvider: (provider: Provider | null) => void; 
  updateChatProvider: (provider: Provider) => void;
  updateAvailableProviders: (providers: Provider[]) => void;
}

/**
 * Actions for mode management
 */
export interface ModeActions {
  setMode: (mode: UiChatMode) => void;
}

/**
 * Actions for feature management
 */
export interface FeatureActions {
  enableFeature: (feature: string) => void;
  disableFeature: (feature: string) => void;
  toggleFeature: (feature: string) => void;
  setFeatureState: (feature: string, enabled: boolean) => void;
}

/**
 * Actions for token management
 */
export interface TokenActions {
  setTokenBalance: (balance: number) => void;
  addTokens: (amount: number) => void;
  spendTokens: (amount: number) => void;
}

/**
 * All chat actions combined
 */
export interface ChatActions extends 
  ChatUIActions, 
  ProviderActions, 
  ModeActions, 
  FeatureActions,
  TokenActions {}

/**
 * Complete chat store type (state + actions)
 */
export type FullChatStore = ChatState & ChatActions;
