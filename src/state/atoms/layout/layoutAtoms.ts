import { atom } from 'jotai';
import { useLayoutStore } from '../../stores/layout/layoutStore';

// Store Atom
export const layoutStoreAtom = atom(() => useLayoutStore.getState());

// UI State Atoms
export const layoutIsMobileAtom = atom<boolean>(false);
export const layoutIsTabletAtom = atom<boolean>(false);
export const layoutIsDesktopAtom = atom<boolean>(false);
export const layoutIsFullscreenAtom = atom<boolean>(false);

// Derived Atoms
export const layoutBreakpointAtom = atom<'sm' | 'md' | 'lg' | 'xl' | '2xl'>((get) => {
  const isMobile = get(layoutIsMobileAtom);
  const isTablet = get(layoutIsTabletAtom);
  const isDesktop = get(layoutIsDesktopAtom);

  if (isMobile) return 'sm';
  if (isTablet) return 'md';
  if (isDesktop) return 'lg';
  return 'xl';
});

export const layoutContentWidthAtom = atom((get) => {
  const store = get(layoutStoreAtom);
  const preferences = store.preferences;
  const breakpoint = get(layoutBreakpointAtom);

  if (preferences.sidebarCollapsed) {
    return `calc(100% - ${preferences.sidebarWidth}px)`;
  }

  return `calc(100% - ${preferences.sidebarWidth}px)`;
});

// Computed Atoms
export const layoutSidebarWidthAtom = atom((get) => {
  const store = get(layoutStoreAtom);
  const preferences = store.preferences;
  return preferences.sidebarCollapsed ? 64 : preferences.sidebarWidth;
});
