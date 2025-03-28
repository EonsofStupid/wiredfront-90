
import { StateCreator } from 'zustand';

/**
 * Generic state setter type
 */
export type SetState<T> = (
  partial: T | Partial<T> | ((state: T) => T | Partial<T>),
  replace?: boolean
) => void;

/**
 * Generic state getter type
 */
export type GetState<T> = () => T;

/**
 * Generic store creator type
 */
export type StoreCreator<T> = StateCreator<T, [], [], T>;
