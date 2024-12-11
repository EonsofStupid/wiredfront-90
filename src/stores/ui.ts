import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { devtools } from 'zustand/middleware';
import type { UIStore, UIAction } from '@/types/store/ui';
import type { PersistConfig, DevToolsConfig, StorageValue } from '@/types/store/middleware';

const persistConfig: PersistConfig<UIStore> = {
  name: 'ui-storage',
  storage: {
    getItem: (name) => {
      const str = localStorage.getItem(name);
      if (!str) return null;
      try {
        return JSON.parse(str) as StorageValue<UIStore>;
      } catch {
        return null;
      }
    },
    setItem: (name, value) => {
      localStorage.setItem(name, JSON.stringify(value));
    },
    removeItem: (name) => {
      localStorage.removeItem(name);
    },
  },
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