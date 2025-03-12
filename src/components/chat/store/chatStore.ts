
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { ChatState, ChatActions } from './types/chat-store-types';
import { createUIActions } from './actions/ui-actions';
import { createFeatureActions } from './actions/feature-actions';
import { createInitializationActions } from './actions/initialization-actions';

// Initial state
const initialState: ChatState = {
  position: 'bottom-right',
  isMinimized: false,
  showSidebar: false,
  isOpen: false,
  scale: 1,
  docked: true,
  isInitialized: false,
  messages: [],
  startTime: Date.now(), // Initialize with current timestamp
  features: {
    codeAssistant: true,
    ragSupport: true,
    githubSync: true,
    notifications: true,
    imageGeneration: false,
    integrations: false,
  },
  providers: {
    currentProvider: 'openai',
    availableProviders: [
      { id: '1', type: 'openai', name: 'OpenAI', isEnabled: true, category: 'chat' },
      { id: '2', type: 'anthropic', name: 'Claude', isEnabled: false, category: 'chat' },
      { id: '3', type: 'gemini', name: 'Gemini', isEnabled: false, category: 'chat' },
      { id: '4', type: 'dalle', name: 'DALL·E', isEnabled: false, category: 'image' },
      { id: '5', type: 'stability', name: 'Stable Diffusion', isEnabled: false, category: 'image' }
    ]
  },
  ui: {
    messageLoading: false,
    sessionLoading: false,
    providerSwitching: false,
  }
};

// Create the store
const useChatStore = create<ChatState & ChatActions>()(
  persist(
    (set, get) => ({
      ...initialState,
      ...createUIActions(set, get),
      ...createFeatureActions(set, get),
      ...createInitializationActions(set, get),
      
      // UI Loading State Actions
      setMessageLoading: (isLoading: boolean) => set(state => ({
        ui: { ...state.ui, messageLoading: isLoading }
      })),
      
      setSessionLoading: (isLoading: boolean) => set(state => ({
        ui: { ...state.ui, sessionLoading: isLoading }
      })),
      
      setProviderSwitching: (isSwitching: boolean) => set(state => ({
        ui: { ...state.ui, providerSwitching: isSwitching }
      })),
    }),
    {
      name: 'chat-settings-storage',
      partialize: (state) => ({
        position: state.position,
        isMinimized: state.isMinimized,
        showSidebar: state.showSidebar,
        isOpen: state.isOpen,
        scale: state.scale,
        docked: state.docked,
        features: state.features,
        providers: state.providers,
        // Don't persist messages, startTime, or UI loading states
      }),
      version: 1,
    }
  )
);

export { useChatStore };
