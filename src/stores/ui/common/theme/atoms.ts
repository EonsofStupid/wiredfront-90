import { atom, Getter, Setter } from 'jotai';
import { atomWithStorage } from 'jotai/utils';
import type { ColorScheme, ThemeMode, ThemeState } from './types';

// Storage key constants
const STORAGE_KEYS = {
  THEME_MODE: 'theme-mode',
  COLOR_SCHEME: 'color-scheme'
} as const;

// Base atoms
export const themeModeAtom = atomWithStorage<ThemeMode>(STORAGE_KEYS.THEME_MODE, 'system');
export const colorSchemeAtom = atomWithStorage<ColorScheme>(STORAGE_KEYS.COLOR_SCHEME, 'light');
export const isDarkAtom = atom((get: Getter) => {
  const mode = get(themeModeAtom);
  if (mode === 'system') {
    return window.matchMedia('(prefers-color-scheme: dark)').matches;
  }
  return mode === 'dark';
});

// Derived atom for the entire theme state
export const themeStateAtom = atom((get: Getter): ThemeState => ({
  mode: get(themeModeAtom),
  colorScheme: get(colorSchemeAtom),
  isDark: get(isDarkAtom)
}));

// Action atoms
export const setThemeModeAtom = atom(
  null,
  (_: Getter, set: Setter, mode: ThemeMode) => {
    set(themeModeAtom, mode);
  }
);

export const setColorSchemeAtom = atom(
  null,
  (_: Getter, set: Setter, scheme: ColorScheme) => {
    set(colorSchemeAtom, scheme);
  }
);

// Reset atom
export const resetThemeAtom = atom(
  null,
  (_: Getter, set: Setter) => {
    set(themeModeAtom, 'system');
    set(colorSchemeAtom, 'light');
  }
);
