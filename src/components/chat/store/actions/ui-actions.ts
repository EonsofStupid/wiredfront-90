
import { StateCreator } from 'zustand';
import { ChatState, ChatProvider, ChatPosition } from '../types/chat-store-types';

export interface UISlice {
  toggleMinimize: () => void;
  toggleSidebar: () => void;
  toggleChat: () => void;
  togglePosition: () => void;
  toggleDocked: () => void;
  setSessionLoading: (isLoading: boolean) => void;
  setMessageLoading: (isLoading: boolean) => void;
  setProviderLoading: (isLoading: boolean) => void;
  setScale: (scale: number) => void;
  setCurrentMode: (mode: 'chat' | 'dev' | 'image') => void;
  updateCurrentProvider: (provider: ChatProvider) => void;
  updateAvailableProviders: (providers: ChatProvider[]) => void;
}

export const createUIActions: StateCreator<ChatState, [], [], UISlice> = (set) => ({
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
  togglePosition: () => {
    set((state) => {
      if (typeof state.position === 'string') {
        const positions: ChatPosition[] = ['bottom-right', 'bottom-left', 'top-right', 'top-left'];
        const currentIndex = positions.indexOf(state.position as ChatPosition);
        const nextIndex = (currentIndex + 1) % positions.length;
        return { position: positions[nextIndex] };
      }
      return { position: 'bottom-right' };
    });
  },
  toggleDocked: () => {
    set((state) => ({
      docked: !state.docked
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
