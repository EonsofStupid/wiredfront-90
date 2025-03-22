import { atom } from "jotai";

// Input and editing state
export const messageInputAtom = atom("");
export const isEditingAtom = atom(false);
export const editingMessageIdAtom = atom<string | null>(null);

// UI toggles
export const isEmojiPickerOpenAtom = atom(false);
export const isMarkdownPreviewOpenAtom = atom(false);
export const messageMenuOpenAtom = atom<Record<string, boolean>>({});
export const messageActionsVisibleAtom = atom<Record<string, boolean>>({});

// Message selection and interaction
export const selectedMessageAtom = atom<string | null>(null);
export const streamingAtom = atom(false);

// Form state (temporary UI state)
export const formStateAtom = atom<{
  isSubmitting: boolean;
  error: string | null;
}>({
  isSubmitting: false,
  error: null,
});
