export interface UserPreferences {
  username: string;
  language: string;
  timezone: string;
  highContrast: boolean;
  reduceMotion: boolean;
  largeText: boolean;
}

export interface GeneralSettingsProps {
  preferences: UserPreferences;
  onPreferenceChange: (key: string, value: string) => void;
}

export interface NotificationPreferences {
  email: boolean;
  push: boolean;
  marketing: boolean;
}

export interface LivePreviewSettings {
  enabled: boolean;
  autoRefresh: boolean;
  refreshInterval: number;
}