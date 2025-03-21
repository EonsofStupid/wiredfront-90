
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { ChatPosition, ChatScale, ChatTheme, LayoutState, DEFAULT_LAYOUT } from '@/types/chat/types';

interface LayoutActions {
  toggleMinimize: () => void;
  toggleOpen: () => void;
  toggleDocked: () => void;
  setPosition: (position: ChatPosition) => void;
  setScale: (scale: ChatScale) => void;
  toggleSidebar: () => void;
  setTheme: (theme: ChatTheme) => void;
  updatePreferences: (prefs: Partial<typeof DEFAULT_LAYOUT.uiPreferences>) => void;
  resetLayout: () => void;
  saveLayoutToStorage: () => Promise<boolean>;
  loadLayoutFromStorage: () => Promise<boolean>;
}

/**
 * Central store for chat UI layout
 */
export const useChatLayoutStore = create<LayoutState & LayoutActions>()(
  persist(
    (set, get) => ({
      // State
      ...DEFAULT_LAYOUT,
      
      // Actions
      toggleMinimize: () => set(state => ({ isMinimized: !state.isMinimized })),
      toggleOpen: () => set(state => ({ isOpen: !state.isOpen })),
      toggleDocked: () => set(state => ({ docked: !state.docked })),
      setPosition: (position) => set({ position }),
      setScale: (scale) => set({ scale }),
      toggleSidebar: () => set(state => ({ showSidebar: !state.showSidebar })),
      setTheme: (theme) => set({ theme }),
      updatePreferences: (prefs) => set(state => ({ 
        uiPreferences: { ...state.uiPreferences, ...prefs } 
      })),
      resetLayout: () => set(DEFAULT_LAYOUT),
      
      // Persistence methods
      saveLayoutToStorage: async () => {
        try {
          const layoutState = get();
          localStorage.setItem('chat-layout', JSON.stringify({
            isMinimized: layoutState.isMinimized,
            docked: layoutState.docked,
            position: layoutState.position,
            scale: layoutState.scale,
            showSidebar: layoutState.showSidebar,
            theme: layoutState.theme,
            uiPreferences: layoutState.uiPreferences
          }));
          return true;
        } catch (error) {
          console.error('Failed to save layout to storage:', error);
          return false;
        }
      },
      
      loadLayoutFromStorage: async () => {
        try {
          const savedLayout = localStorage.getItem('chat-layout');
          if (savedLayout) {
            const layout = JSON.parse(savedLayout);
            set({
              isMinimized: layout.isMinimized ?? DEFAULT_LAYOUT.isMinimized,
              docked: layout.docked ?? DEFAULT_LAYOUT.docked,
              position: layout.position ?? DEFAULT_LAYOUT.position,
              scale: layout.scale ?? DEFAULT_LAYOUT.scale,
              showSidebar: layout.showSidebar ?? DEFAULT_LAYOUT.showSidebar,
              theme: layout.theme ?? DEFAULT_LAYOUT.theme,
              uiPreferences: {
                ...DEFAULT_LAYOUT.uiPreferences,
                ...(layout.uiPreferences || {})
              }
            });
            return true;
          }
          return false;
        } catch (error) {
          console.error('Failed to load layout from storage:', error);
          return false;
        }
      }
    }),
    {
      name: 'chat-layout-storage',
      partialize: (state) => ({
        isMinimized: state.isMinimized,
        docked: state.docked,
        position: state.position,
        scale: state.scale,
        showSidebar: state.showSidebar,
        theme: state.theme,
        uiPreferences: state.uiPreferences
      })
    }
  )
);

// Selectors for more granular access
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
  toggleMinimize: useChatLayoutStore(state => state.toggleMinimize),
  toggleOpen: useChatLayoutStore(state => state.toggleOpen),
  toggleDocked: useChatLayoutStore(state => state.toggleDocked),
  setPosition: useChatLayoutStore(state => state.setPosition),
  setScale: useChatLayoutStore(state => state.setScale),
  toggleSidebar: useChatLayoutStore(state => state.toggleSidebar),
  setTheme: useChatLayoutStore(state => state.setTheme),
  updatePreferences: useChatLayoutStore(state => state.updatePreferences),
  resetLayout: useChatLayoutStore(state => state.resetLayout),
  saveLayoutToStorage: useChatLayoutStore(state => state.saveLayoutToStorage),
  loadLayoutFromStorage: useChatLayoutStore(state => state.loadLayoutFromStorage)
});
