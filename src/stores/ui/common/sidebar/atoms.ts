import { atom } from 'jotai';
import { atomWithStorage } from 'jotai/utils';
import type { SidebarState } from './types';

const DEFAULT_SIDEBAR_WIDTH = 280;
const MIN_SIDEBAR_WIDTH = 200;
const MAX_SIDEBAR_WIDTH = 400;

// Base atoms for sidebar state
export const sidebarVisibleAtom = atomWithStorage<boolean>('sidebar-visible', true);
export const sidebarWidthAtom = atomWithStorage<number>('sidebar-width', DEFAULT_SIDEBAR_WIDTH);
export const sidebarCollapsedAtom = atomWithStorage<boolean>('sidebar-collapsed', false);
export const sidebarActiveSectionAtom = atom<string | null>(null);

// Derived atoms for computed values
export const sidebarStateAtom = atom<SidebarState>((get) => ({
  isVisible: get(sidebarVisibleAtom),
  width: get(sidebarWidthAtom),
  isCollapsed: get(sidebarCollapsedAtom),
  activeSection: get(sidebarActiveSectionAtom)
}));

// Action atoms
export const toggleSidebarVisibilityAtom = atom(
  null,
  (get, set) => {
    set(sidebarVisibleAtom, !get(sidebarVisibleAtom));
  }
);

export const setSidebarWidthAtom = atom(
  null,
  (get, set, width: number) => {
    const clampedWidth = Math.min(Math.max(width, MIN_SIDEBAR_WIDTH), MAX_SIDEBAR_WIDTH);
    set(sidebarWidthAtom, clampedWidth);
  }
);

export const toggleSidebarCollapseAtom = atom(
  null,
  (get, set) => {
    set(sidebarCollapsedAtom, !get(sidebarCollapsedAtom));
  }
);

export const setSidebarActiveSectionAtom = atom(
  null,
  (get, set, section: string | null) => {
    set(sidebarActiveSectionAtom, section);
  }
);
