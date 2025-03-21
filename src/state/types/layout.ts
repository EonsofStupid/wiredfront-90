export interface LayoutPreferences {
  sidebarWidth: number;
  sidebarCollapsed: boolean;
  headerHeight: number;
  footerHeight: number;
  mainContentPadding: number;
  showSidebar: boolean;
  showHeader: boolean;
  showFooter: boolean;
  layoutMode: 'default' | 'compact' | 'expanded';
}

export interface LayoutState {
  // UI State
  isMobile: boolean;
  isTablet: boolean;
  isDesktop: boolean;
  isFullscreen: boolean;

  // Layout State
  preferences: LayoutPreferences;
  breakpoints: {
    sm: number;
    md: number;
    lg: number;
    xl: number;
    '2xl': number;
  };

  // Actions
  setLayoutMode: (mode: LayoutPreferences['layoutMode']) => void;
  toggleSidebar: () => void;
  toggleFullscreen: () => void;
  updatePreferences: (prefs: Partial<LayoutPreferences>) => void;
  resetToDefaults: () => void;
}
