import type { ActionType, BaseAction, User, NotificationSettings } from './common';
import type { AsyncState, DevToolsConfig } from '../stores/core/types';
import type { UIState } from './ui';
import type { AuthState } from './auth';
import type { DataState } from './data';
import type { SettingsState } from './settings';

// Type guard for checking if an action is valid
export const isValidAction = <T extends ActionType>(
  action: unknown,
  type: T
): action is BaseAction<T> => {
  return (
    typeof action === 'object' &&
    action !== null &&
    'type' in action &&
    action.type === type
  );
};

// Type guard for checking if a payload exists and matches expected type
export const hasPayload = <T extends ActionType, P>(
  action: BaseAction<T>,
  payloadGuard: (payload: unknown) => payload is P
): action is BaseAction<T, P> => {
  return 'payload' in action && payloadGuard(action.payload);
};

// Type guard for User
export const isUser = (value: unknown): value is User => {
  return (
    typeof value === 'object' &&
    value !== null &&
    'id' in value &&
    'email' in value &&
    'name' in value &&
    'role' in value &&
    'preferences' in value
  );
};

// Type guard for AsyncState
export const isAsyncState = (value: unknown): value is AsyncState => {
  return (
    typeof value === 'object' &&
    value !== null &&
    'status' in value &&
    'error' in value &&
    'lastUpdated' in value
  );
};

// Type guard for UIState
export const isUIState = (value: unknown): value is UIState => {
  return (
    typeof value === 'object' &&
    value !== null &&
    'theme' in value &&
    'sidebarOpen' in value &&
    'activePanel' in value
  );
};

// Type guard for AuthState
export const isAuthState = (value: unknown): value is AuthState => {
  return (
    typeof value === 'object' &&
    value !== null &&
    'user' in value &&
    'isAuthenticated' in value &&
    'token' in value
  );
};

// Type guard for DataState
export const isDataState = (value: unknown): value is DataState => {
  return (
    typeof value === 'object' &&
    value !== null &&
    'metrics' in value &&
    'analytics' in value &&
    'lastFetch' in value &&
    isAsyncState(value)
  );
};

// Type guard for SettingsState
export const isSettingsState = (value: unknown): value is SettingsState => {
  return (
    typeof value === 'object' &&
    value !== null &&
    'preferences' in value &&
    'dashboardLayout' in value &&
    'notifications' in value
  );
};

// Type guard for NotificationSettings
export const isNotificationSettings = (value: unknown): value is NotificationSettings => {
  return (
    typeof value === 'object' &&
    value !== null &&
    'email' in value &&
    'push' in value &&
    'frequency' in value &&
    'types' in value &&
    Array.isArray((value as NotificationSettings).types)
  );
};

// Validation utility for checking if a state update is valid
export const isValidStateUpdate = <T extends object>(
  currentState: T,
  update: Partial<T>
): boolean => {
  return Object.keys(update).every((key) => key in currentState);
};

// Type assertion function with runtime validation
export function assertType<T>(
  value: unknown,
  guard: (value: unknown) => value is T,
  message = 'Type assertion failed'
): asserts value is T {
  if (!guard(value)) {
    throw new TypeError(message);
  }
}
