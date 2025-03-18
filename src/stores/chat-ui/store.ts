
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { ChatUIStore } from './types';

const initialState = {
  isDocked: true,
  isMinimized: false,
  position: 'bottom-right' as const,
  scale: 1,
  theme: 'cyberpunk' as const,
  dockState: {
    visible: false,
    position: 'right' as const,
    width: 300,
    height: 500,
    items: ['memory', 'files'],
    activeItem: null,
  },
  showCommandBar: false,
  quickActionsVisible: true,
  isGlassEffect: true,
  keyboardShortcutsEnabled: true,
};

export const useChatUIStore = create<ChatUIStore>()(
  persist(
    (set, get) => ({
      ...initialState,
      
      toggleDock: () => set((state) => ({ isDocked: !state.isDocked })),
      
      toggleMinimize: () => set((state) => ({ isMinimized: !state.isMinimized })),
      
      setPosition: (position) => set({ position }),
      
      setScale: (scale) => set({ scale }),
      
      setTheme: (theme) => set({ theme }),
      
      toggleDockVisibility: () => set((state) => ({
        dockState: {
          ...state.dockState,
          visible: !state.dockState.visible,
        },
      })),
      
      setDockPosition: (position) => set((state) => ({
        dockState: {
          ...state.dockState,
          position,
        },
      })),
      
      toggleCommandBar: () => set((state) => ({
        showCommandBar: !state.showCommandBar,
      })),
      
      toggleQuickActions: () => set((state) => ({
        quickActionsVisible: !state.quickActionsVisible,
      })),
      
      toggleGlassEffect: () => set((state) => ({
        isGlassEffect: !state.isGlassEffect,
      })),
      
      toggleKeyboardShortcuts: () => set((state) => ({
        keyboardShortcutsEnabled: !state.keyboardShortcutsEnabled,
      })),
      
      addDockItem: (item) => set((state) => {
        if (state.dockState.items.includes(item)) return state;
        return {
          dockState: {
            ...state.dockState,
            items: [...state.dockState.items, item],
            activeItem: state.dockState.activeItem || item,
          },
        };
      }),
      
      removeDockItem: (item) => set((state) => ({
        dockState: {
          ...state.dockState,
          items: state.dockState.items.filter((i) => i !== item),
          activeItem: state.dockState.activeItem === item
            ? (state.dockState.items.find((i) => i !== item) || null)
            : state.dockState.activeItem,
        },
      })),
      
      setActiveDockItem: (item) => set((state) => ({
        dockState: {
          ...state.dockState,
          activeItem: item,
        },
      })),
      
      resetUI: () => set(initialState),
    }),
    {
      name: 'chat-ui-storage',
      partialize: (state) => ({
        isDocked: state.isDocked,
        position: state.position,
        theme: state.theme,
        dockState: {
          visible: state.dockState.visible,
          position: state.dockState.position,
          items: state.dockState.items,
        },
        isGlassEffect: state.isGlassEffect,
        keyboardShortcutsEnabled: state.keyboardShortcutsEnabled,
      }),
      version: 1,
    }
  )
);
