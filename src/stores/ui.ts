import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { devtools } from 'zustand/middleware';
import type { UIStore } from '@/types/store/ui';
import type { PersistConfig, DevToolsConfig } from '@/types/store/middleware';

const persistConfig: PersistConfig = {
  name: 'ui-storage',
  storage: localStorage,
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
        setTheme: (theme) => set({ theme }),
        toggleSidebar: () => set((state) => ({ sidebarOpen: !state.sidebarOpen })),
        setActivePanel: (panelId) => set({ activePanel: panelId }),
      }),
      persistConfig
    ),
    devtoolsConfig
  )
);