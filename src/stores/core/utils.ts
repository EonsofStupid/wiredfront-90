
import type { Action, ActionType } from './types';
import { EnumUtils } from '@/lib/enums';

export const createAction = <T extends ActionType, P = void>(
  type: T,
  payload?: P
): Action<T, P> => ({
  type,
  payload,
});

export const exists = <T>(value: T | null | undefined): value is T => {
  return value !== null && value !== undefined;
};

export const createTimestamp = (): number => Date.now();

export const getPropSafely = <T extends object, K extends keyof T>(
  obj: T,
  key: K
): T[K] | undefined => {
  return obj[key];
};

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

const isObject = (item: unknown): item is object => {
  return Boolean(item && typeof item === 'object' && !Array.isArray(item));
};
