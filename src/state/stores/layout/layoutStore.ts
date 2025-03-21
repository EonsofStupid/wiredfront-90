import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { LayoutPreferences, LayoutState } from '../../types/layout';

const defaultPreferences: LayoutPreferences = {
  sidebarWidth: 280,
  sidebarCollapsed: false,
  headerHeight: 64,
  footerHeight: 48,
  mainContentPadding: 24,
  showSidebar: true,
  showHeader: true,
  showFooter: true,
  layoutMode: 'default',
};

const defaultBreakpoints = {
  sm: 640,
  md: 768,
  lg: 1024,
  xl: 1280,
  '2xl': 1536,
};

export const useLayoutStore = create<LayoutState>()(
  persist(
    (set) => ({
      // UI State
      isMobile: false,
      isTablet: false,
      isDesktop: false,
      isFullscreen: false,

      // Layout State
      preferences: defaultPreferences,
      breakpoints: defaultBreakpoints,

      // Actions
      setLayoutMode: (mode) =>
        set((state) => ({
          preferences: { ...state.preferences, layoutMode: mode },
        })),
      toggleSidebar: () =>
        set((state) => ({
          preferences: {
            ...state.preferences,
            sidebarCollapsed: !state.preferences.sidebarCollapsed,
          },
        })),
      toggleFullscreen: () =>
        set((state) => ({ isFullscreen: !state.isFullscreen })),
      updatePreferences: (prefs) =>
        set((state) => ({
          preferences: { ...state.preferences, ...prefs },
        })),
      resetToDefaults: () => set({
        preferences: defaultPreferences,
        breakpoints: defaultBreakpoints,
      }),
    }),
    {
      name: 'layout-store',
    }
  )
);
