export interface User {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  preferences: UserPreferences;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export type UserRole = 'admin' | 'user' | 'viewer';

export interface UserPreferences {
  defaultView: string;
  refreshInterval: number;
  notifications: boolean;
  timezone: string;
}

export type NotificationType = 'alerts' | 'updates' | 'reports';

export interface NotificationSettings {
  email: boolean;
  push: boolean;
  frequency: 'realtime' | 'daily' | 'weekly';
  types: NotificationType[];
}