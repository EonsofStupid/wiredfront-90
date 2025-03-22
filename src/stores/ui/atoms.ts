import { atom } from "jotai";

// Message UI State
export const selectedMessageIdAtom = atom<string | null>(null);
export const editingMessageIdAtom = atom<string | null>(null);
export const isEditingAtom = atom((get) => get(editingMessageIdAtom) !== null);

// Form State
export const formStateAtom = atom({
  isSubmitting: false,
  isDirty: false,
  isValid: true,
});

// Component-specific UI State
export const isMessageMenuOpenAtom = atom<Record<string, boolean>>({});
export const isMessageActionsVisibleAtom = atom<Record<string, boolean>>({});
