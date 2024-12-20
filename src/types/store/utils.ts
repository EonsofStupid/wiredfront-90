import type { Action, ActionType } from './core';

// Create a type-safe action creator
export const createAction = <T extends ActionType, P = void>(
  type: T,
  payload?: P
): Action<T, P> => ({
  type,
  payload,
});

// Type guard for checking if a value exists
export const exists = <T>(value: T | null | undefined): value is T => {
  return value !== null && value !== undefined;
};

// Utility to create a timestamp
export const createTimestamp = (): number => Date.now();

// Type-safe object property accessor
export const getPropSafely = <T extends object, K extends keyof T>(
  obj: T,
  key: K
): T[K] | undefined => {
  return obj[key];
};

// Deep merge utility for state updates
export const deepMerge = <T extends object>(target: T, source: Partial<T>): T => {
  const output = { ...target };
  
  if (isObject(target) && isObject(source)) {
    Object.keys(source).forEach((key) => {
      if (isObject(source[key as keyof T])) {
        if (!(key in target)) {
          Object.assign(output, { [key]: source[key as keyof T] });
        } else {
          output[key as keyof T] = deepMerge(
            target[key as keyof T] as object,
            source[key as keyof T] as object
          ) as T[keyof T];
        }
      } else {
        Object.assign(output, { [key]: source[key as keyof T] });
      }
    });
  }
  return output;
};

// Type guard for checking if a value is an object
const isObject = (item: unknown): item is object => {
  return Boolean(item && typeof item === 'object' && !Array.isArray(item));
};