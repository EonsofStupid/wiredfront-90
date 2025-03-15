
import { SetState } from 'zustand';
import { ChatState, ChatProvider } from '../types/chat-store-types';

export const createUIActions = (set: SetState<ChatState>) => ({
  toggleMinimize: () => {
    set((state) => ({
      isMinimized: !state.isMinimized,
    }));
  },
  toggleSidebar: () => {
    set((state) => ({
      showSidebar: !state.showSidebar,
    }));
  },
  toggleChat: () => {
    set((state) => ({
      isOpen: !state.isOpen,
    }));
  },
  setSessionLoading: (isLoading: boolean) => {
    set((state) => ({
      ui: {
        ...state.ui,
        sessionLoading: isLoading,
      },
    }));
  },
  setMessageLoading: (isLoading: boolean) => {
    set((state) => ({
      ui: {
        ...state.ui,
        messageLoading: isLoading,
      },
    }));
  },
  setProviderLoading: (isLoading: boolean) => {
    set((state) => ({
      ui: {
        ...state.ui,
        providerLoading: isLoading,
      },
    }));
  },
  setScale: (scale: number) => {
    set(() => ({
      scale,
    }));
  },
  setCurrentMode: (mode: 'chat' | 'dev' | 'image') => {
    set(() => ({
      currentMode: mode,
    }));
  },
  // Add the missing updateCurrentProvider action
  updateCurrentProvider: (provider: ChatProvider) => {
    set((state) => ({
      currentProvider: provider,
      providers: {
        ...state.providers,
        availableProviders: state.providers?.availableProviders.map(p => 
          p.id === provider.id ? {...p, isDefault: true} : {...p, isDefault: false}
        ) || []
      }
    }));
  },
  // Add function to update available providers
  updateAvailableProviders: (providers: ChatProvider[]) => {
    set((state) => ({
      providers: {
        ...state.providers,
        availableProviders: providers
      }
    }));
  }
});

export type UIActions = ReturnType<typeof createUIActions>;
