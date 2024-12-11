import { UserPreferences, NotificationSettings } from './common';
import { DashboardLayout } from '../dashboard/common';

export interface SettingsStore {
  preferences: UserPreferences;
  dashboardLayout: DashboardLayout;
  notifications: NotificationSettings;
  updatePreferences: (updates: Partial<UserPreferences>) => void;
  saveDashboardLayout: (layout: DashboardLayout) => void;
  updateNotifications: (settings: Partial<NotificationSettings>) => void;
}

export type SettingsAction = 
  | { type: 'UPDATE_PREFERENCES'; payload: Partial<UserPreferences> }
  | { type: 'SAVE_LAYOUT'; payload: DashboardLayout }
  | { type: 'UPDATE_NOTIFICATIONS'; payload: Partial<NotificationSettings> };