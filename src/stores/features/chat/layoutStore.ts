import { ChatPosition, ChatScale, ChatTheme, ChatUIPreferences, DEFAULT_UI_PREFERENCES } from '@/types/chat/ui';
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

// Default position for the chat button
const DEFAULT_POSITION: ChatPosition = { x: 20, y: 20 };

interface ChatLayoutState {
  // UI state
  isOpen: boolean;
  isMinimized: boolean;
  docked: boolean;
  position: ChatPosition;
  scale: ChatScale;
  showSidebar: boolean;
  theme: ChatTheme;
  uiPreferences: ChatUIPreferences;
}

interface ChatLayoutActions {
  // Actions
  toggleOpen: () => void;
  toggleMinimize: () => void;
  toggleDocked: () => void;
  toggleSidebar: () => void;
  setPosition: (position: ChatPosition) => void;
  setScale: (scale: ChatScale) => void;
  setTheme: (theme: ChatTheme) => void;
  updatePreferences: (prefs: Partial<ChatUIPreferences>) => void;
  resetLayout: () => void;
}

type ChatLayoutStore = ChatLayoutState & ChatLayoutActions;

export const useChatLayoutStore = create<ChatLayoutStore>()(
  persist(
    (set) => ({
      // Default state
      isOpen: false,
      isMinimized: false,
      docked: true,
      position: DEFAULT_POSITION,
      scale: 1,
      showSidebar: false,
      theme: 'system',
      uiPreferences: DEFAULT_UI_PREFERENCES,

      // Actions
      toggleOpen: () => set((state) => ({
        isOpen: !state.isOpen
      })),

      toggleMinimize: () => set((state) => ({
        isMinimized: !state.isMinimized
      })),

      toggleDocked: () => set((state) => ({
        docked: !state.docked
      })),

      toggleSidebar: () => set((state) => ({
        showSidebar: !state.showSidebar
      })),

      setPosition: (position) => set({ position }),

      setScale: (scale) => set({ scale }),

      setTheme: (theme) => set({ theme }),

      updatePreferences: (prefs) => set((state) => ({
        uiPreferences: { ...state.uiPreferences, ...prefs }
      })),

      resetLayout: () => set({
        isOpen: false,
        isMinimized: false,
        docked: true,
        position: DEFAULT_POSITION,
        scale: 1,
        showSidebar: false,
        theme: 'system',
        uiPreferences: DEFAULT_UI_PREFERENCES
      })
    }),
    {
      name: 'chat-layout-storage',
      partialize: (state) => ({
        position: state.position,
        scale: state.scale,
        docked: state.docked,
        theme: state.theme,
        uiPreferences: state.uiPreferences
      })
    }
  )
);

// Exported selectors for more granular access to the store
export const useLayoutState = () => ({
  isMinimized: useChatLayoutStore(state => state.isMinimized),
  isOpen: useChatLayoutStore(state => state.isOpen),
  docked: useChatLayoutStore(state => state.docked),
  position: useChatLayoutStore(state => state.position),
  scale: useChatLayoutStore(state => state.scale),
  showSidebar: useChatLayoutStore(state => state.showSidebar),
  theme: useChatLayoutStore(state => state.theme),
  uiPreferences: useChatLayoutStore(state => state.uiPreferences)
});

export const useLayoutActions = () => ({
  toggleOpen: useChatLayoutStore(state => state.toggleOpen),
  toggleMinimize: useChatLayoutStore(state => state.toggleMinimize),
  toggleDocked: useChatLayoutStore(state => state.toggleDocked),
  setPosition: useChatLayoutStore(state => state.setPosition),
  setScale: useChatLayoutStore(state => state.setScale),
  toggleSidebar: useChatLayoutStore(state => state.toggleSidebar),
  setTheme: useChatLayoutStore(state => state.setTheme),
  updatePreferences: useChatLayoutStore(state => state.updatePreferences),
  resetLayout: useChatLayoutStore(state => state.resetLayout)
});
