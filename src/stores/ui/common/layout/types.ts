export interface LayoutState {
  isFullscreen: boolean;
  isMobile: boolean;
  isTablet: boolean;
  isDesktop: boolean;
  viewportWidth: number;
  viewportHeight: number;
  activeBreakpoint: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl';
}

export interface LayoutActions {
  toggleFullscreen: () => void;
  setViewportSize: (width: number, height: number) => void;
  setActiveBreakpoint: (breakpoint: LayoutState['activeBreakpoint']) => void;
}

export type LayoutStore = LayoutState & LayoutActions;
