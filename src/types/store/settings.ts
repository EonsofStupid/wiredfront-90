import type { UserPreferences, NotificationSettings } from './common';
import type { DashboardLayout } from '../dashboard/common';

export interface SettingsState {
  preferences: UserPreferences;
  dashboardLayout: DashboardLayout;
  notifications: NotificationSettings;
}

export interface SettingsActions {
  updatePreferences: (updates: Partial<UserPreferences>) => void;
  saveDashboardLayout: (layout: DashboardLayout) => void;
  updateNotifications: (settings: Partial<NotificationSettings>) => void;
}

export type SettingsStore = SettingsState & SettingsActions;

export type SettingsAction = 
  | { type: 'UPDATE_PREFERENCES'; payload: Partial<UserPreferences> }
  | { type: 'SAVE_LAYOUT'; payload: DashboardLayout }
  | { type: 'UPDATE_NOTIFICATIONS'; payload: Partial<NotificationSettings> };