
export interface User {
  id: string;
  email: string;
  name?: string;
  role: string;
  preferences?: Record<string, any>;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export type ActionType = string;

export interface BaseAction<T extends ActionType = ActionType, P = unknown> {
  type: T;
  payload?: P;
}

export interface NotificationSettings {
  email: boolean;
  push: boolean;
  frequency: 'daily' | 'weekly' | 'realtime';
  types: string[];
  marketing: boolean;
}

export interface LivePreviewSettings {
  enabled: boolean;
  autoStart?: boolean;
  logLevel?: 'debug' | 'info' | 'warn' | 'error';
}

export interface UserPreferences {
  defaultView: string;
  refreshInterval: number;
  notifications: boolean;
  timezone: string;
  highContrast: boolean;
  reduceMotion: boolean;
  largeText: boolean;
  username: string;
  language: string;
  livePreview: LivePreviewSettings;
}
