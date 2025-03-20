export type ThemeMode = 'light' | 'dark' | 'system';
export type ColorScheme = 'light' | 'dark';

export interface ThemeState {
  mode: ThemeMode;
  colorScheme: ColorScheme;
  isDark: boolean;
}

export interface ThemeActions {
  setMode: (mode: ThemeMode) => void;
  setColorScheme: (scheme: ColorScheme) => void;
  reset: () => void;
  initialize: () => void;
}
