import { atom } from 'jotai';
import { atomWithStorage } from 'jotai/utils';
import type { ChatMessage } from './types';

// Input state
export const chatInputAtom = atomWithStorage<string>('chat-input', '');
export const isComposingAtom = atom<boolean>(false);
export const isSubmittingAtom = atom<boolean>(false);

// Message state
export const messagesAtom = atomWithStorage<ChatMessage[]>('chat-messages', []);
export const selectedMessageAtom = atom<ChatMessage | null>(null);
export const messageActionsVisibleAtom = atom<boolean>(false);

// UI state
export const chatHeightAtom = atomWithStorage<number>('chat-height', 500);
export const chatWidthAtom = atomWithStorage<number>('chat-width', 400);
export const chatOpacityAtom = atomWithStorage<number>('chat-opacity', 1);
export const chatThemeAtom = atomWithStorage<'light' | 'dark'>('chat-theme', 'dark');

// Derived state
export const hasMessagesAtom = atom((get) => get(messagesAtom).length > 0);
export const lastMessageAtom = atom((get) => {
  const messages = get(messagesAtom);
  return messages[messages.length - 1] || null;
});

// Actions
export const appendMessageAtom = atom(
  null,
  (get, set, message: ChatMessage) => {
    set(messagesAtom, [...get(messagesAtom), message]);
  }
);

export const clearMessagesAtom = atom(
  null,
  (get, set) => {
    set(messagesAtom, []);
  }
);

export const updateMessageAtom = atom(
  null,
  (get, set, updatedMessage: ChatMessage) => {
    set(messagesAtom, get(messagesAtom).map(msg =>
      msg.id === updatedMessage.id ? updatedMessage : msg
    ));
  }
);

export const deleteMessageAtom = atom(
  null,
  (get, set, messageId: string) => {
    set(messagesAtom, get(messagesAtom).filter(msg => msg.id !== messageId));
  }
);
