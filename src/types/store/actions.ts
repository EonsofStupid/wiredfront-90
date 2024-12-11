import type { ActionType, BaseAction } from './common';
import { isValidAction, hasPayload } from './guards';

// Helper type for creating strict action creators
export type ActionCreator<T extends ActionType, P = void> = P extends void
  ? () => BaseAction<T>
  : (payload: P) => BaseAction<T, P>;

// Action creator factory with runtime validation
export const createAction = <T extends ActionType, P = void>(
  type: T,
  payloadGuard?: (payload: unknown) => payload is P
): ActionCreator<T, P> => {
  return ((payload?: P) => {
    if (payload !== undefined) {
      if (payloadGuard && !payloadGuard(payload)) {
        throw new TypeError(`Invalid payload for action type: ${type}`);
      }
      return { type, payload } as const;
    }
    return { type } as const;
  }) as ActionCreator<T, P>;
};

// Type guard for checking if an action matches a specific type
export const isActionOfType = <T extends ActionType>(
  action: BaseAction<ActionType>,
  type: T
): action is BaseAction<T> => {
  return action.type === type;
};

// Helper function to validate action payload
export const validateActionPayload = <T extends ActionType, P>(
  action: BaseAction<T>,
  payloadGuard: (payload: unknown) => payload is P
): action is BaseAction<T, P> => {
  return hasPayload(action, payloadGuard);
};