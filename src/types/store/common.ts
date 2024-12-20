// Base type for all action payloads
export type ActionPayload = unknown;

// Strict type for all action types
export type ActionType = string;

// Base interface for all actions
export interface BaseAction<T extends ActionType, P = ActionPayload> {
  readonly type: T;
  readonly payload?: P;
}

export interface User {
  readonly id: string;
  readonly email: string;
  readonly name: string;
  readonly role: UserRole;
  readonly preferences: Readonly<UserPreferences>;
}

export interface LoginCredentials {
  readonly email: string;
  readonly password: string;
}

export type UserRole = 'admin' | 'user' | 'viewer';

export interface UserPreferences {
  readonly defaultView: string;
  readonly refreshInterval: number;
  readonly notifications: boolean;
  readonly timezone: string;
  readonly highContrast: boolean;
  readonly reduceMotion: boolean;
  readonly largeText: boolean;
  readonly username: string;
  readonly language: string;
}

export type NotificationType = 'alerts' | 'updates' | 'reports';

export interface NotificationSettings {
  readonly email: boolean;
  readonly push: boolean;
  readonly frequency: 'realtime' | 'daily' | 'weekly';
  readonly types: readonly NotificationType[];
  readonly marketing: boolean;
}