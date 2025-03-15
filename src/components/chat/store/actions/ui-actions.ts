
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

export const createUIActions: StateCreator<
  ChatState, 
  [["zustand/devtools", never]], 
  [], 
  UISlice
> = (set, get, api) => ({
  toggleMinimize: () => {
    set(
      (state) => ({
        ...state,
        isMinimized: !state.isMinimized,
      }),
      false,
      { type: 'ui/toggleMinimize' }
    );
  },
  toggleSidebar: () => {
    set(
      (state) => ({
        ...state,
        showSidebar: !state.showSidebar,
      }),
      false,
      { type: 'ui/toggleSidebar' }
    );
  },
  toggleChat: () => {
    set(
      (state) => ({
        ...state,
        isOpen: !state.isOpen,
      }),
      false,
      { type: 'ui/toggleChat' }
    );
  },
  togglePosition: () => {
    set(
      (state) => {
        if (typeof state.position === 'string') {
          const positions: ChatPosition[] = ['bottom-right', 'bottom-left', 'top-right', 'top-left'];
          const currentIndex = positions.indexOf(state.position as ChatPosition);
          const nextIndex = (currentIndex + 1) % positions.length;
          return { ...state, position: positions[nextIndex] };
        }
        return { ...state, position: 'bottom-right' };
      },
      false,
      { type: 'ui/togglePosition' }
    );
  },
  toggleDocked: () => {
    set(
      (state) => ({
        ...state,
        docked: !state.docked
      }),
      false,
      { type: 'ui/toggleDocked' }
    );
  },
  setSessionLoading: (isLoading: boolean) => {
    set(
      (state) => ({
        ...state,
        ui: {
          ...state.ui,
          sessionLoading: isLoading,
        },
      }),
      false,
      { type: 'ui/setSessionLoading', isLoading }
    );
  },
  setMessageLoading: (isLoading: boolean) => {
    set(
      (state) => ({
        ...state,
        ui: {
          ...state.ui,
          messageLoading: isLoading,
        },
      }),
      false,
      { type: 'ui/setMessageLoading', isLoading }
    );
  },
  setProviderLoading: (isLoading: boolean) => {
    set(
      (state) => ({
        ...state,
        ui: {
          ...state.ui,
          providerLoading: isLoading,
        },
      }),
      false,
      { type: 'ui/setProviderLoading', isLoading }
    );
  },
  setScale: (scale: number) => {
    set(
      (state) => ({
        ...state,
        scale,
      }),
      false,
      { type: 'ui/setScale', scale }
    );
  },
  setCurrentMode: (mode: 'chat' | 'dev' | 'image') => {
    set(
      (state) => ({
        ...state,
        currentMode: mode,
      }),
      false,
      { type: 'ui/setCurrentMode', mode }
    );
  },
  updateCurrentProvider: (provider: ChatProvider) => {
    set(
      (state) => ({
        ...state,
        currentProvider: provider,
        providers: {
          ...state.providers,
          availableProviders: state.providers?.availableProviders.map(p => 
            p.id === provider.id ? {...p, isDefault: true} : {...p, isDefault: false}
          ) || []
        }
      }),
      false,
      { type: 'ui/updateCurrentProvider', provider }
    );
  },
  updateAvailableProviders: (providers: ChatProvider[]) => {
    set(
      (state) => ({
        ...state,
        providers: {
          ...state.providers,
          availableProviders: providers
        }
      }),
      false,
      { type: 'ui/updateAvailableProviders', providers }
    );
  }
});

export type UIActions = ReturnType<typeof createUIActions>;
