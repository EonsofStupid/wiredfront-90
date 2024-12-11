import type { BaseAction } from './common';
import type { UserPreferences, NotificationSettings } from './common';
import type { DashboardLayout } from '../dashboard/common';

export interface SettingsState {
  readonly preferences: Readonly<UserPreferences>;
  readonly dashboardLayout: Readonly<DashboardLayout>;
  readonly notifications: Readonly<NotificationSettings>;
}

export interface SettingsActions {
  readonly updatePreferences: (updates: Partial<UserPreferences>) => void;
  readonly saveDashboardLayout: (layout: DashboardLayout) => void;
  readonly updateNotifications: (settings: Partial<NotificationSettings>) => void;
}

export type SettingsStore = Readonly<SettingsState & SettingsActions>;

export type SettingsActionType =
  | 'UPDATE_PREFERENCES'
  | 'SAVE_LAYOUT'
  | 'UPDATE_NOTIFICATIONS';

export type SettingsAction = 
  | BaseAction<'UPDATE_PREFERENCES', Partial<UserPreferences>>
  | BaseAction<'SAVE_LAYOUT', DashboardLayout>
  | BaseAction<'UPDATE_NOTIFICATIONS', Partial<NotificationSettings>>;