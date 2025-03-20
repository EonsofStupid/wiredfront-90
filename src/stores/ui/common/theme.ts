import { atom, Getter, Setter } from 'jotai';
import { atomWithStorage } from 'jotai/utils';

// Types
export type ThemeMode = 'light' | 'dark' | 'system';
export type ColorScheme = 'light' | 'dark';

export interface ThemeState {
  mode: ThemeMode;
  colorScheme: ColorScheme;
  isDark: boolean;
}

// Base atoms
export const themeModeAtom = atomWithStorage<ThemeMode>('theme-mode', 'system');
export const colorSchemeAtom = atom<ColorScheme>('light');

// Derived atom for the entire theme state
export const themeStateAtom = atom((get: Getter) => ({
  mode: get(themeModeAtom),
  colorScheme: get(colorSchemeAtom),
  isDark: get(colorSchemeAtom) === 'dark'
}));

// Action atoms
export const setThemeModeAtom = atom(
  null,
  (get: Getter, set: Setter, mode: ThemeMode) => {
    set(themeModeAtom, mode);
    // Update color scheme based on mode
    if (mode === 'system') {
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      set(colorSchemeAtom, prefersDark ? 'dark' : 'light');
    } else {
      set(colorSchemeAtom, mode);
    }
  }
);

export const setColorSchemeAtom = atom(
  null,
  (get: Getter, set: Setter, scheme: ColorScheme) => {
    set(colorSchemeAtom, scheme);
  }
);

// System theme change listener
export const initializeThemeAtom = atom(
  null,
  (get: Getter, set: Setter) => {
    const mode = get(themeModeAtom);
    if (mode === 'system') {
      const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
      const updateTheme = (e: MediaQueryListEvent) => {
        set(colorSchemeAtom, e.matches ? 'dark' : 'light');
      };

      mediaQuery.addEventListener('change', updateTheme);
      return () => mediaQuery.removeEventListener('change', updateTheme);
    }
  }
);

// Reset atom
export const resetThemeAtom = atom(
  null,
  (get: Getter, set: Setter) => {
    set(themeModeAtom, 'system');
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    set(colorSchemeAtom, prefersDark ? 'dark' : 'light');
  }
);
