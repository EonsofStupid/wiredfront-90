export interface NotificationSettingsState {
  email: boolean;
  push: boolean;
  frequency: 'daily' | 'weekly' | 'realtime';
  types: string[];
  marketing: boolean;
}

export interface NotificationSettingsActions {
  updateNotifications: (settings: Partial<NotificationSettingsState>) => void;
}

export type NotificationSettingsStore = NotificationSettingsState & NotificationSettingsActions;