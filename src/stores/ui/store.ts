import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { UIStore } from './types';

const Z_INDEX = {
  modal: 1000,
  dropdown: 900,
  tooltip: 800,
  navbar: 700,
  floating: 600,
  content: 500,
  background: 400,
  base: 300,
} as const;

const initialState: UIStore = {
  theme: 'system',
  layout: {
    sidebarExpanded: true,
    contentWidth: 'contained',
  },
  accessibility: {
    reducedMotion: false,
    highContrast: false,
    fontSize: 'normal',
  },
  zIndex: Z_INDEX,

  setTheme: () => {},
  toggleSidebar: () => {},
  updateLayout: () => {},
  updateAccessibility: () => {},
};

export const useUIStore = create<UIStore>()(
  persist(
    (set) => ({
      ...initialState,

      setTheme: (theme) => set({ theme }),

      toggleSidebar: () =>
        set((state) => ({
          layout: {
            ...state.layout,
            sidebarExpanded: !state.layout.sidebarExpanded,
          },
        })),

      updateLayout: (updates) =>
        set((state) => ({
          layout: { ...state.layout, ...updates },
        })),

      updateAccessibility: (updates) =>
        set((state) => ({
          accessibility: { ...state.accessibility, ...updates },
        })),
    }),
    {
      name: 'ui-storage',
      partialize: (state) => ({
        theme: state.theme,
        accessibility: state.accessibility,
      }),
    }
  )
);