import { atom } from 'jotai';
// Base atoms for layout state
export const layoutStateAtom = atom({
    isFullscreen: false,
    isMobile: false,
    isTablet: false,
    isDesktop: false,
    viewportWidth: typeof window !== 'undefined' ? window.innerWidth : 0,
    viewportHeight: typeof window !== 'undefined' ? window.innerHeight : 0,
    activeBreakpoint: 'md'
});
// Action atoms
export const toggleFullscreenAtom = atom(null, (get, set) => {
    set(layoutStateAtom, {
        ...get(layoutStateAtom),
        isFullscreen: !get(layoutStateAtom).isFullscreen
    });
});
export const setViewportSizeAtom = atom(null, (get, set, { width, height }) => {
    const state = get(layoutStateAtom);
    const isMobile = width < 640;
    const isTablet = width >= 640 && width < 1024;
    const isDesktop = width >= 1024;
    // Determine breakpoint
    let activeBreakpoint = 'md';
    if (width < 640)
        activeBreakpoint = 'xs';
    else if (width < 768)
        activeBreakpoint = 'sm';
    else if (width < 1024)
        activeBreakpoint = 'md';
    else if (width < 1280)
        activeBreakpoint = 'lg';
    else if (width < 1536)
        activeBreakpoint = 'xl';
    else
        activeBreakpoint = '2xl';
    set(layoutStateAtom, {
        ...state,
        viewportWidth: width,
        viewportHeight: height,
        isMobile,
        isTablet,
        isDesktop,
        activeBreakpoint
    });
});
// Derived atoms for computed values
export const isMobileAtom = atom((get) => get(layoutStateAtom).isMobile);
export const isTabletAtom = atom((get) => get(layoutStateAtom).isTablet);
export const isDesktopAtom = atom((get) => get(layoutStateAtom).isDesktop);
export const viewportWidthAtom = atom((get) => get(layoutStateAtom).viewportWidth);
export const viewportHeightAtom = atom((get) => get(layoutStateAtom).viewportHeight);
export const activeBreakpointAtom = atom((get) => get(layoutStateAtom).activeBreakpoint);
