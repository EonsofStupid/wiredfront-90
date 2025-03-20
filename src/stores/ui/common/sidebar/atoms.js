import { atom } from 'jotai';
import { atomWithStorage } from 'jotai/utils';
const DEFAULT_SIDEBAR_WIDTH = 280;
const MIN_SIDEBAR_WIDTH = 200;
const MAX_SIDEBAR_WIDTH = 400;
// Base atoms for sidebar state
export const sidebarVisibleAtom = atomWithStorage('sidebar-visible', true);
export const sidebarWidthAtom = atomWithStorage('sidebar-width', DEFAULT_SIDEBAR_WIDTH);
export const sidebarCollapsedAtom = atomWithStorage('sidebar-collapsed', false);
export const sidebarActiveSectionAtom = atom(null);
// Derived atoms for computed values
export const sidebarStateAtom = atom((get) => ({
    isVisible: get(sidebarVisibleAtom),
    width: get(sidebarWidthAtom),
    isCollapsed: get(sidebarCollapsedAtom),
    activeSection: get(sidebarActiveSectionAtom)
}));
// Action atoms
export const toggleSidebarVisibilityAtom = atom(null, (get, set) => {
    set(sidebarVisibleAtom, !get(sidebarVisibleAtom));
});
export const setSidebarWidthAtom = atom(null, (get, set, width) => {
    const clampedWidth = Math.min(Math.max(width, MIN_SIDEBAR_WIDTH), MAX_SIDEBAR_WIDTH);
    set(sidebarWidthAtom, clampedWidth);
});
export const toggleSidebarCollapseAtom = atom(null, (get, set) => {
    set(sidebarCollapsedAtom, !get(sidebarCollapsedAtom));
});
export const setSidebarActiveSectionAtom = atom(null, (get, set, section) => {
    set(sidebarActiveSectionAtom, section);
});
