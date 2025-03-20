import { atom } from 'jotai';
import { atomWithStorage } from 'jotai/utils';
// Storage key constants
const STORAGE_KEYS = {
    THEME_MODE: 'theme-mode',
    COLOR_SCHEME: 'color-scheme'
};
// Base atoms
export const themeModeAtom = atomWithStorage(STORAGE_KEYS.THEME_MODE, 'system');
export const colorSchemeAtom = atomWithStorage(STORAGE_KEYS.COLOR_SCHEME, 'light');
export const isDarkAtom = atom((get) => {
    const mode = get(themeModeAtom);
    if (mode === 'system') {
        return window.matchMedia('(prefers-color-scheme: dark)').matches;
    }
    return mode === 'dark';
});
// Derived atom for the entire theme state
export const themeStateAtom = atom((get) => ({
    mode: get(themeModeAtom),
    colorScheme: get(colorSchemeAtom),
    isDark: get(isDarkAtom)
}));
// Action atoms
export const setThemeModeAtom = atom(null, (_, set, mode) => {
    set(themeModeAtom, mode);
});
export const setColorSchemeAtom = atom(null, (_, set, scheme) => {
    set(colorSchemeAtom, scheme);
});
// Reset atom
export const resetThemeAtom = atom(null, (_, set) => {
    set(themeModeAtom, 'system');
    set(colorSchemeAtom, 'light');
});
