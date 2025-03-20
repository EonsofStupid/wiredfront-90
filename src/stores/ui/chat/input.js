import { atom } from 'jotai';
import { atomWithStorage } from 'jotai/utils';
// Base atoms
export const inputValueAtom = atomWithStorage('chat-input-value', '');
export const isWaitingForResponseAtom = atom(false);
export const inputErrorAtom = atom(null);
export const isComposingAtom = atom(false);
export const lastSubmittedAtom = atom(null);
// Derived atom for the entire input state
export const inputStateAtom = atom((get) => ({
    value: get(inputValueAtom),
    isWaitingForResponse: get(isWaitingForResponseAtom),
    error: get(inputErrorAtom),
    isComposing: get(isComposingAtom),
    lastSubmitted: get(lastSubmittedAtom)
}));
// Action atoms
export const setInputValueAtom = atom(null, (get, set, value) => {
    set(inputValueAtom, value);
    set(inputErrorAtom, null);
});
export const clearInputAtom = atom(null, (get, set) => {
    set(inputValueAtom, '');
    set(inputErrorAtom, null);
});
export const setWaitingForResponseAtom = atom(null, (get, set, isWaiting) => {
    set(isWaitingForResponseAtom, isWaiting);
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
    set(isWaitingForResponseAtom, false);
    set(inputErrorAtom, null);
    set(isComposingAtom, false);
    set(lastSubmittedAtom, null);
});
