import { atom, Getter, Setter } from 'jotai';
import { atomWithStorage } from 'jotai/utils';

// Types
export interface ChatInputState {
  value: string;
  isWaitingForResponse: boolean;
  error: string | null;
  isComposing: boolean;
  lastSubmitted: string | null;
}

// Base atoms
export const inputValueAtom = atomWithStorage<string>('chat-input-value', '');
export const isWaitingForResponseAtom = atom<boolean>(false);
export const inputErrorAtom = atom<string | null>(null);
export const isComposingAtom = atom<boolean>(false);
export const lastSubmittedAtom = atom<string | null>(null);

// Derived atom for the entire input state
export const inputStateAtom = atom((get: Getter) => ({
  value: get(inputValueAtom),
  isWaitingForResponse: get(isWaitingForResponseAtom),
  error: get(inputErrorAtom),
  isComposing: get(isComposingAtom),
  lastSubmitted: get(lastSubmittedAtom)
}));

// Action atoms
export const setInputValueAtom = atom(
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

export const setWaitingForResponseAtom = atom(
  null,
  (get: Getter, set: Setter, isWaiting: boolean) => {
    set(isWaitingForResponseAtom, isWaiting);
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
    set(isWaitingForResponseAtom, false);
    set(inputErrorAtom, null);
    set(isComposingAtom, false);
    set(lastSubmittedAtom, null);
  }
);
