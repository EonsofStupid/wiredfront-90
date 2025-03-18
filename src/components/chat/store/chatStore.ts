
import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import { ChatState, ChatMode, ProviderCategory } from './types/chat-store-types';
import { createFeatureActions } from './actions/feature';
import { createUIActions } from './actions/ui-actions';
import { createInitializationActions } from './actions/initialization-actions';
import { TokenEnforcementMode } from '@/integrations/supabase/types/enums';

// Initial chat state
const initialState = {
  initialized: false,
  messages: [],
  userInput: '',
  isWaitingForResponse: false,
  selectedModel: 'gpt-3.5-turbo',
  selectedMode: 'chat',
  modelFetchStatus: 'idle' as const,
  error: null,
  chatId: null,
  docked: true,
  isOpen: false,
  isHidden: false,
  position: 'bottom-right' as const,
  startTime: Date.now(),
  currentMode: 'chat' as ChatMode,
  isMinimized: false,
  showSidebar: false,
  scale: 1,
  ui: {
    sessionLoading: false,
    messageLoading: false,
    providerLoading: false,
  },
  features: {
    voice: false,
    rag: false,
    modeSwitch: true,
    notifications: true,
    github: false,
    codeAssistant: true,
    ragSupport: false,
    githubSync: false,
    tokenEnforcement: true,
  },
  availableProviders: [],
  currentProvider: null,
  tokenControl: {
    balance: 0,
    enforcementMode: TokenEnforcementMode.STRICT,
    lastUpdated: null,
    tokensPerQuery: 0,
    freeQueryLimit: 0,
    queriesUsed: 0,
  },
  providers: {
    availableProviders: [],
  }
};

export const useChatStore = create<ChatState>()(
  devtools(
    (set, get) => ({
      ...initialState,
      
      // Add messages to the chat
      addMessage: (message) => set((state) => ({
        messages: [...state.messages, message],
      }), false, { type: 'chat/addMessage' }),
      
      // Update an existing message
      updateMessage: (id, updates) => set((state) => ({
        messages: state.messages.map((message) => 
          message.id === id ? { ...message, ...updates } : message
        ),
      }), false, { type: 'chat/updateMessage' }),
      
      // Reset the chat state to initial values
      resetChatState: () => set(initialState, false, { type: 'chat/resetChatState' }),
      
      // Update user input field
      setUserInput: (input) => set({ userInput: input }, false, { type: 'chat/setUserInput' }),
      
      // Toggle between bottom-left and bottom-right positions
      togglePosition: () => set((state) => {
        const newPosition = typeof state.position === 'string' 
          ? (state.position === 'bottom-right' ? 'bottom-left' : 'bottom-right')
          : 'bottom-right';
        return { position: newPosition };
      }, false, { type: 'chat/togglePosition' }),
      
      // Toggle docked state (whether the chat window is fixed or draggable)
      toggleDocked: () => set((state) => ({ docked: !state.docked }), false, { type: 'chat/toggleDocked' }),
      
      // Set chat scaling factor
      setScale: (scale) => set({ scale }, false, { type: 'chat/setScale' }),
      
      // Toggle sidebar visibility
      toggleSidebar: () => set((state) => ({ showSidebar: !state.showSidebar }), false, { type: 'chat/toggleSidebar' }),
      
      // Feature actions
      ...createFeatureActions(set, get),
      
      // UI actions
      ...createUIActions(set, get),
      
      // Initialization actions
      ...createInitializationActions(set, get),
    }),
    { name: 'chat-store' }
  )
);
