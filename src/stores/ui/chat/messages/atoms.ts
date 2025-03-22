import { Message } from "@/types/chat/messages";
import { atom } from "jotai";

// Base atoms
export const messagesAtom = atom<Message[]>([]);
export const isLoadingAtom = atom<boolean>(false);
export const errorAtom = atom<string | null>(null);
export const selectedMessageIdAtom = atom<string | null>(null);
export const isEditingAtom = atom<boolean>(false);
export const editingMessageIdAtom = atom<string | null>(null);

// Derived atoms
export const selectedMessageAtom = atom(
  (get) => {
    const selectedId = get(selectedMessageIdAtom);
    const messages = get(messagesAtom);
    return selectedId ? messages.find((msg) => msg.id === selectedId) : null;
  },
  (get, set, message: Message | null) => {
    set(selectedMessageIdAtom, message?.id || null);
  }
);

export const editingMessageAtom = atom(
  (get) => {
    const editingId = get(editingMessageIdAtom);
    const messages = get(messagesAtom);
    return editingId ? messages.find((msg) => msg.id === editingId) : null;
  },
  (get, set, message: Message | null) => {
    set(editingMessageIdAtom, message?.id || null);
    set(isEditingAtom, !!message);
  }
);
