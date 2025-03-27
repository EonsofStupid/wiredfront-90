
import { produce } from 'immer';
import { ChatPosition, ChatState } from '@/components/chat/store/types/chat-store-types';

export const createUIActions = (set: any) => ({
  toggleChat: () => {
    set(
      produce((state: ChatState) => {
        state.isOpen = !state.isOpen;
      })
    );
  },

  toggleMinimize: () => {
    set(
      produce((state: ChatState) => {
        state.isMinimized = !state.isMinimized;
      })
    );
  },

  setSessionLoading: (isLoading: boolean) => {
    set(
      produce((state: ChatState) => {
        state.ui = {
          ...state.ui,
          sessionLoading: isLoading,
          messageLoading: state.ui.messageLoading,
          providerLoading: state.ui.providerLoading,
          isChatLoaded: state.ui.isChatLoaded,
          isChatInitialized: state.ui.isChatInitialized
        };
      })
    );
  },

  setMessageLoading: (isLoading: boolean) => {
    set(
      produce((state: ChatState) => {
        state.ui = {
          ...state.ui,
          sessionLoading: state.ui.sessionLoading,
          messageLoading: isLoading,
          providerLoading: state.ui.providerLoading,
          isChatLoaded: state.ui.isChatLoaded,
          isChatInitialized: state.ui.isChatInitialized
        };
      })
    );
  },

  setProviderLoading: (isLoading: boolean) => {
    set(
      produce((state: ChatState) => {
        state.ui = {
          ...state.ui,
          sessionLoading: state.ui.sessionLoading,
          messageLoading: state.ui.messageLoading,
          providerLoading: isLoading,
          isChatLoaded: state.ui.isChatLoaded,
          isChatInitialized: state.ui.isChatInitialized
        };
      })
    );
  },

  setCurrentMode: (mode: string) => {
    set(
      produce((state: ChatState) => {
        state.currentMode = mode;
      })
    );
  },

  setPosition: (position: ChatPosition) => {
    set(
      produce((state: ChatState) => {
        state.position = position;
      })
    );
  },

  toggleSidebar: () => {
    set(
      produce((state: ChatState) => {
        state.showSidebar = !state.showSidebar;
      })
    );
  },

  toggleDock: () => {
    set(
      produce((state: ChatState) => {
        state.docked = !state.docked;
      })
    );
  },

  setScale: (scale: number) => {
    set(
      produce((state: ChatState) => {
        state.scale = scale;
      })
    );
  },

  setChatId: (id: string | null) => {
    set(
      produce((state: ChatState) => {
        state.chatId = id;
      })
    );
  },

  toggleUIState: (key: keyof ChatState, value?: boolean) => {
    set(
      produce((state: ChatState) => {
        if (typeof value === 'boolean') {
          (state as any)[key] = value;
        } else {
          (state as any)[key] = !(state as any)[key];
        }
      })
    );
  },
});
