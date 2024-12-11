import type { ActionType, BaseAction } from './common';

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

// Helper type for creating strict action creators
export type ActionCreator<T extends ActionType, P = void> = P extends void
  ? () => BaseAction<T>
  : (payload: P) => BaseAction<T, P>;