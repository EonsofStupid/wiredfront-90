import { atom, Getter, Setter } from 'jotai';
import { atomWithStorage } from 'jotai/utils';
import type { ChatInputState } from './types';

// Storage key constants
const STORAGE_KEYS = {
  INPUT_VALUE: 'chat-input-value'
} as const;

// Base atoms
export const inputValueAtom = atomWithStorage<string>(STORAGE_KEYS.INPUT_VALUE, '');
export const isWaitingAtom = atom<boolean>(false);
export const inputErrorAtom = atom<string | null>(null);
export const isComposingAtom = atom<boolean>(false);
export const lastSubmittedAtom = atom<string | null>(null);

// Derived atom for the entire input state
export const inputStateAtom = atom((get: Getter): ChatInputState => ({
  value: get(inputValueAtom),
  isWaitingForResponse: get(isWaitingAtom),
  error: get(inputErrorAtom),
  isComposing: get(isComposingAtom),
  lastSubmitted: get(lastSubmittedAtom)
}));

// Action atoms
export const setValueAtom = atom(
  null,
  (get: Getter, set: Setter, value: string) => {
    set(inputValueAtom, value);
    set(inputErrorAtom, null);
  }
);

export const clearInputAtom = atom(
  null,
  (get: Getter, set: Setter) => {
    set(inputValueAtom, '');
    set(inputErrorAtom, null);
  }
);

export const setWaitingAtom = atom(
  null,
  (get: Getter, set: Setter, isWaiting: boolean) => {
    set(isWaitingAtom, isWaiting);
  }
);

export const setInputErrorAtom = atom(
  null,
  (get: Getter, set: Setter, error: string | null) => {
    set(inputErrorAtom, error);
  }
);

export const setComposingAtom = atom(
  null,
  (get: Getter, set: Setter, isComposing: boolean) => {
    set(isComposingAtom, isComposing);
  }
);

export const submitInputAtom = atom(
  null,
  (get: Getter, set: Setter) => {
    const currentValue = get(inputValueAtom);
    if (currentValue.trim()) {
      set(lastSubmittedAtom, currentValue);
      set(inputValueAtom, '');
      set(inputErrorAtom, null);
    }
  }
);

// Reset atom
export const resetInputAtom = atom(
  null,
  (get: Getter, set: Setter) => {
    set(inputValueAtom, '');
    set(isWaitingAtom, false);
    set(inputErrorAtom, null);
    set(isComposingAtom, false);
    set(lastSubmittedAtom, null);
  }
);
