import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { UIState, UIStore } from './types';

const initialState: UIState = {
  version: '1.0.0',
  theme: 'light',
  sidebarOpen: false,
  activePanel: null,
};

export const useUIStore = create<UIStore>()(
  persist(
    (set) => ({
      ...initialState,
      setTheme: (theme) => set({ theme }),
      toggleSidebar: () => set((state) => ({ sidebarOpen: !state.sidebarOpen })),
      setActivePanel: (panelId) => set({ activePanel: panelId }),
    }),
    {
      name: 'ui-storage',
    }
  )
);