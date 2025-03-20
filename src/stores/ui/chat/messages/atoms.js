import { atom } from 'jotai';
import { atomWithStorage } from 'jotai/utils';
// Storage key constants
const STORAGE_KEYS = {
    MESSAGES: 'chat-messages',
    IS_TYPING: 'chat-is-typing',
    ERROR: 'chat-error'
};
// Base atoms
export const messagesAtom = atomWithStorage(STORAGE_KEYS.MESSAGES, []);
export const isTypingAtom = atom(false);
export const errorAtom = atom(null);
// Action atoms
export const addMessageAtom = atom(null, (get, set, message) => {
    const currentMessages = get(messagesAtom);
    set(messagesAtom, [...currentMessages, message]);
});
export const updateMessageAtom = atom(null, (get, set, { id, content }) => {
    const currentMessages = get(messagesAtom);
    set(messagesAtom, currentMessages.map(msg => msg.id === id ? { ...msg, content } : msg));
});
export const removeMessageAtom = atom(null, (get, set, id) => {
    const currentMessages = get(messagesAtom);
    set(messagesAtom, currentMessages.filter(msg => msg.id !== id));
});
export const clearMessagesAtom = atom(null, (_, set) => {
    set(messagesAtom, []);
});
export const setTypingAtom = atom(null, (_, set, isTyping) => {
    set(isTypingAtom, isTyping);
});
export const setErrorAtom = atom(null, (_, set, error) => {
    set(errorAtom, error);
});
