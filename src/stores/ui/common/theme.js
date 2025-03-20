import { atom } from 'jotai';
import { atomWithStorage } from 'jotai/utils';
// Base atoms
export const themeModeAtom = atomWithStorage('theme-mode', 'system');
export const colorSchemeAtom = atom('light');
// Derived atom for the entire theme state
export const themeStateAtom = atom((get) => ({
    mode: get(themeModeAtom),
    colorScheme: get(colorSchemeAtom),
    isDark: get(colorSchemeAtom) === 'dark'
}));
// Action atoms
export const setThemeModeAtom = atom(null, (get, set, mode) => {
    set(themeModeAtom, mode);
    // Update color scheme based on mode
    if (mode === 'system') {
        const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
        set(colorSchemeAtom, prefersDark ? 'dark' : 'light');
    }
    else {
        set(colorSchemeAtom, mode);
    }
});
export const setColorSchemeAtom = atom(null, (get, set, scheme) => {
    set(colorSchemeAtom, scheme);
});
// System theme change listener
export const initializeThemeAtom = atom(null, (get, set) => {
    const mode = get(themeModeAtom);
    if (mode === 'system') {
        const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
        const updateTheme = (e) => {
            set(colorSchemeAtom, e.matches ? 'dark' : 'light');
        };
        mediaQuery.addEventListener('change', updateTheme);
        return () => mediaQuery.removeEventListener('change', updateTheme);
    }
});
// Reset atom
export const resetThemeAtom = atom(null, (get, set) => {
    set(themeModeAtom, 'system');
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    set(colorSchemeAtom, prefersDark ? 'dark' : 'light');
});
