import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { devtools } from 'zustand/middleware';
import type { UIStore, UIAction } from '@/types/store/ui';
import type { DevToolsConfig } from '@/types/store/middleware';

const persistConfig = {
  name: 'ui-storage',
  storage: {
    getItem: (name: string) => {
      const str = localStorage.getItem(name);
      if (!str) return null;
      try {
        return JSON.parse(str);
      } catch {
        return null;
      }
    },
    setItem: (name: string, value: any) => {
      localStorage.setItem(name, JSON.stringify(value));
    },
    removeItem: (name: string) => {
      localStorage.removeItem(name);
    },
  },
  partialize: (state: UIStore) => ({
    theme: state.theme,
    sidebarOpen: state.sidebarOpen,
    activePanel: state.activePanel,
  }),
};

const devtoolsConfig: DevToolsConfig = {
  name: 'UI Store',
  enabled: process.env.NODE_ENV === 'development',
};

export const useUIStore = create<UIStore>()(
  devtools(
    persist(
      (set) => ({
        theme: 'dark',
        sidebarOpen: false,
        activePanel: null,
        setTheme: (theme) => 
          set({ theme }, false, { type: 'SET_THEME', payload: theme }),
        toggleSidebar: () => 
          set(
            (state) => ({ sidebarOpen: !state.sidebarOpen }), 
            false, 
            { type: 'TOGGLE_SIDEBAR' }
          ),
        setActivePanel: (panelId) => 
          set(
            { activePanel: panelId }, 
            false, 
            { type: 'SET_ACTIVE_PANEL', payload: panelId }
          ),
      }),
      persistConfig
    ),
    devtoolsConfig
  )
);