import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { ChatMode, ChatPosition, ChatProvider, ChatState, ChatStore } from './types';

const initialState: ChatState = {
  // UI State
  isOpen: false,
  isMinimized: false,
  showSidebar: true,
  scale: 1,
  docked: false,
  position: 'bottom-right',

  // Session State
  currentSessionId: null,
  currentMode: 'chat',
  currentProvider: null,
  availableProviders: [],

  // Loading States
  isInitialized: false,
  isLoading: false,
  error: null,
};

export const useChatStore = create<ChatStore>()(
  persist(
    (set, get) => ({
      ...initialState,

      // UI Actions
      toggleChat: () => set(state => ({ isOpen: !state.isOpen })),
      toggleMinimize: () => set(state => ({ isMinimized: !state.isMinimized })),
      toggleSidebar: () => set(state => ({ showSidebar: !state.showSidebar })),
      setScale: (scale: number) => set({ scale }),
      setDocked: (docked: boolean) => set({ docked }),
      setPosition: (position: ChatPosition) => set({ position }),

      // Session Actions
      setCurrentSession: (sessionId: string) => set({ currentSessionId: sessionId }),
      setCurrentMode: (mode: ChatMode) => set({ currentMode: mode }),
      setCurrentProvider: (provider: ChatProvider) => set({ currentProvider: provider }),
      updateAvailableProviders: (providers: ChatProvider[]) => set({ availableProviders: providers }),

      // State Management
      initialize: async () => {
        set({ isLoading: true, error: null });
        try {
          // Load available providers
          // This would typically come from an API call or configuration
          const providers: ChatProvider[] = [
            {
              id: 'default',
              name: 'Default Provider',
              description: 'Default chat provider',
              supportedModes: ['chat', 'code', 'doc'],
              isEnabled: true,
            }
          ];

          set({
            availableProviders: providers,
            currentProvider: providers[0],
            isInitialized: true,
            isLoading: false,
          });
        } catch (error) {
          set({
            error: error instanceof Error ? error.message : 'Failed to initialize chat',
            isLoading: false,
          });
        }
      },

      reset: () => set(initialState),
      setError: (error: string | null) => set({ error }),
    }),
    {
      name: 'chat-store',
      partialize: (state) => ({
        position: state.position,
        currentMode: state.currentMode,
        currentProvider: state.currentProvider,
      }),
    }
  )
);
