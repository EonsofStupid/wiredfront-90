
import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';
import { v4 as uuidv4 } from 'uuid';
import { createInitializationActions } from './actions/initialization-actions';
import { createFeatureActions } from './actions/feature-actions';
import { createUIActions } from './actions/ui-actions';
import { createSessionActions } from './actions/session-actions';
import { ChatMode, ChatState } from './types/chat-store-types';

// Define the full store type with all action slices
type FullChatStore = ChatState & 
  ReturnType<typeof createInitializationActions> & 
  ReturnType<typeof createFeatureActions> & 
  ReturnType<typeof createUIActions> &
  ReturnType<typeof createSessionActions>;

const initialState: ChatState = {
  initialized: false,
  messages: [],
  userInput: '',
  isWaitingForResponse: false,
  selectedModel: 'gpt-4',
  selectedMode: 'chat',
  modelFetchStatus: 'idle',
  error: null,
  chatId: null,
  docked: true,
  isOpen: false,
  isHidden: false,
  position: 'bottom-right',
  startTime: Date.now(),
  features: {
    voice: true,
    rag: true,
    modeSwitch: true,
    notifications: true,
    github: true,
    // Add new feature flags matching what UI components expect
    codeAssistant: true,
    ragSupport: true,
    githubSync: true,
  },
  currentMode: 'chat',
  availableProviders: [],
  currentProvider: null,
  
  // Add session management
  currentSession: null,
  sessions: {},
  
  // Add token management
  tokenUsage: {
    available: 10, // Default starting tokens
    used: 0,
    lastRefilled: new Date().toISOString()
  },
  
  // Add providers mapping for session management
  providers: {
    availableProviders: [],
  },
  
  // UI state properties
  isMinimized: false,
  showSidebar: false,
  scale: 1,
  ui: {
    sessionLoading: false,
    messageLoading: false,
    providerLoading: false,
  },
};

export const useChatStore = create<FullChatStore>()(
  devtools(
    persist(
      (set, get, api) => ({
        ...initialState,
        ...createInitializationActions(set, get, api),
        ...createFeatureActions(set, get, api),
        ...createUIActions(set, get, api),
        ...createSessionActions(set, get, api),
      }),
      {
        name: 'ChatStore',
        partialize: (state) => ({
          docked: state.docked,
          position: state.position,
          isMinimized: state.isMinimized,
          scale: state.scale,
          showSidebar: state.showSidebar,
          sessions: state.sessions, // Persist sessions
          currentSession: state.currentSession, // Persist current session
          tokenUsage: state.tokenUsage, // Persist token usage
          features: state.features, // Persist feature flags
        }),
      }
    ),
    {
      name: 'ChatStore',
      enabled: process.env.NODE_ENV !== 'production',
    }
  )
);
