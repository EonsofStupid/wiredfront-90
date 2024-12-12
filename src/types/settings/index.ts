export type ThemeMode = 'light' | 'dark' | 'system';

export interface UserPreferences {
  theme: ThemeMode;
  language: string;
  defaultView: string;
  refreshInterval: number;
  notifications: boolean;
  timezone: string;
}

export interface SettingsContextValue {
  preferences: UserPreferences;
  updatePreferences: (updates: Partial<UserPreferences>) => void;
  resetPreferences: () => void;
}