import type { Message } from '@/types/chat/messages';
import { atom, Getter, Setter } from 'jotai';
import { atomWithStorage } from 'jotai/utils';

// Storage key constants
const STORAGE_KEYS = {
  MESSAGES: 'chat-messages',
  IS_TYPING: 'chat-is-typing',
  ERROR: 'chat-error'
} as const;

// Base atoms
export const messagesAtom = atomWithStorage<Message[]>(STORAGE_KEYS.MESSAGES, []);
export const isTypingAtom = atom<boolean>(false);
export const errorAtom = atom<string | null>(null);

// Action atoms
export const addMessageAtom = atom(
  null,
  (get: Getter, set: Setter, message: Message) => {
    const currentMessages = get(messagesAtom);
    set(messagesAtom, [...currentMessages, message]);
  }
);

export const updateMessageAtom = atom(
  null,
  (get: Getter, set: Setter, { id, content }: { id: string; content: string }) => {
    const currentMessages = get(messagesAtom);
    set(messagesAtom, currentMessages.map(msg =>
      msg.id === id ? { ...msg, content } : msg
    ));
  }
);

export const removeMessageAtom = atom(
  null,
  (get: Getter, set: Setter, id: string) => {
    const currentMessages = get(messagesAtom);
    set(messagesAtom, currentMessages.filter(msg => msg.id !== id));
  }
);

export const clearMessagesAtom = atom(
  null,
  (_: Getter, set: Setter) => {
    set(messagesAtom, []);
  }
);

export const setTypingAtom = atom(
  null,
  (_: Getter, set: Setter, isTyping: boolean) => {
    set(isTypingAtom, isTyping);
  }
);

export const setErrorAtom = atom(
  null,
  (_: Getter, set: Setter, error: string | null) => {
    set(errorAtom, error);
  }
);
