import { atom } from 'jotai';
import { atomWithStorage } from 'jotai/utils';
// Storage key constants
const STORAGE_KEYS = {
    INPUT_VALUE: 'chat-input-value'
};
// Base atoms
export const inputValueAtom = atomWithStorage(STORAGE_KEYS.INPUT_VALUE, '');
export const isWaitingAtom = atom(false);
export const inputErrorAtom = atom(null);
export const isComposingAtom = atom(false);
export const lastSubmittedAtom = atom(null);
// Derived atom for the entire input state
export const inputStateAtom = atom((get) => ({
    value: get(inputValueAtom),
    isWaitingForResponse: get(isWaitingAtom),
    error: get(inputErrorAtom),
    isComposing: get(isComposingAtom),
    lastSubmitted: get(lastSubmittedAtom)
}));
// Action atoms
export const setValueAtom = atom(null, (get, set, value) => {
    set(inputValueAtom, value);
    set(inputErrorAtom, null);
});
export const clearInputAtom = atom(null, (get, set) => {
    set(inputValueAtom, '');
    set(inputErrorAtom, null);
});
export const setWaitingAtom = atom(null, (get, set, isWaiting) => {
    set(isWaitingAtom, isWaiting);
});
export const setInputErrorAtom = atom(null, (get, set, error) => {
    set(inputErrorAtom, error);
});
export const setComposingAtom = atom(null, (get, set, isComposing) => {
    set(isComposingAtom, isComposing);
});
export const submitInputAtom = atom(null, (get, set) => {
    const currentValue = get(inputValueAtom);
    if (currentValue.trim()) {
        set(lastSubmittedAtom, currentValue);
        set(inputValueAtom, '');
        set(inputErrorAtom, null);
    }
});
// Reset atom
export const resetInputAtom = atom(null, (get, set) => {
    set(inputValueAtom, '');
    set(isWaitingAtom, false);
    set(inputErrorAtom, null);
    set(isComposingAtom, false);
    set(lastSubmittedAtom, null);
});
