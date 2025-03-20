
import { UserPreferences } from '@/types/store/common/types';

export interface SettingsState {
  preferences: UserPreferences;
  theme: 'light' | 'dark' | 'system';
  isLoading: boolean;
  error: Error | null;
}

export interface SettingsActions {
  updatePreferences: (preferences: Partial<UserPreferences>) => void;
  setTheme: (theme: SettingsState['theme']) => void;
  resetSettings: () => void;
}

export type SettingsStore = SettingsState & SettingsActions;
