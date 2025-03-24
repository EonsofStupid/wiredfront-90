
import { ChatMode } from "@/integrations/supabase/types/enums";
import { StateCreator } from "zustand";
import { ChatProvider, ChatPosition, ChatState, UIStateActions } from "../types/chat-store-types";

type UIStore = ChatState & UIStateActions;
type UISlice = Pick<UIStore, keyof UIStateActions>;

export const createUIActions: StateCreator<UIStore, [], [], UISlice> = (
  set,
  get,
  store
) => ({
  toggleMinimize: () => set({ isMinimized: !get().isMinimized }),
  toggleSidebar: () => set({ showSidebar: !get().showSidebar }),
  toggleChat: () => set({ isOpen: !get().isOpen }),

  setSessionLoading: (isLoading: boolean) =>
    set({ ui: { ...get().ui, sessionLoading: isLoading } }),

  setMessageLoading: (isLoading: boolean) =>
    set({ ui: { ...get().ui, messageLoading: isLoading } }),

  setProviderLoading: (isLoading: boolean) =>
    set({ ui: { ...get().ui, providerLoading: isLoading } }),

  setScale: (scale: number) => set({ scale }),

  setCurrentMode: (mode: ChatMode) => set({ currentMode: mode }),

  setUserInput: (input: string) => set({ userInput: input }),
});

// Additional UI actions that need to be added to the store
export const additionalUIActions: StateCreator<
  ChatState,
  [],
  [],
  Pick<ChatState, 'togglePosition' | 'toggleDocked' | 'setIsHidden' | 'updateCurrentProvider' | 'updateAvailableProviders'>
> = (set, get) => ({
  togglePosition: () => {
    set((state) => {
      if (typeof state.position === 'string') {
        const positions: ChatPosition[] = ['bottom-right', 'bottom-left', 'top-right', 'top-left'];
        const currentIndex = positions.indexOf(state.position as ChatPosition);
        const nextIndex = (currentIndex + 1) % positions.length;
        return { ...state, position: positions[nextIndex] };
      }
      return { ...state, position: 'bottom-right' };
    });
  },
  
  toggleDocked: () => {
    set((state) => ({
      ...state,
      docked: !state.docked
    }));
  },
  
  setIsHidden: (hidden: boolean) => {
    set({ isHidden: hidden });
  },
  
  updateCurrentProvider: (provider: ChatProvider) => {
    set((state) => ({
      ...state,
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
      ...state,
      availableProviders: providers,
      providers: {
        ...state.providers,
        availableProviders: providers
      }
    }));
  }
});
