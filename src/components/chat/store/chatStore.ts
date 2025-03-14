
import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import { v4 as uuidv4 } from 'uuid';
import { createInitializationActions } from './actions/initialization-actions';
import { createFeatureActions } from './actions/feature-actions';
import { createUIActions } from './actions/ui-actions';
import { ChatState } from './types/chat-store-types';

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

export const useChatStore = create<
  ChatState & ReturnType<typeof createInitializationActions> & ReturnType<typeof createFeatureActions> & ReturnType<typeof createUIActions>
>()(
  devtools(
    (set, get) => ({
      ...initialState,
      ...createInitializationActions(set, get),
      ...createFeatureActions(set),
      ...createUIActions(set),
    }),
    {
      name: 'ChatStore',
      enabled: process.env.NODE_ENV !== 'production',
    }
  )
);
