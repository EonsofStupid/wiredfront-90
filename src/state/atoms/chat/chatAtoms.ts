import { atom } from "jotai";
import { atomWithStorage } from "jotai/utils";

// UI State Atoms
export const chatIsDockedAtom = atomWithStorage("chat-is-docked", false);
export const chatIsMinimizedAtom = atomWithStorage("chat-is-minimized", false);
export const chatPositionAtom = atomWithStorage("chat-position", {
  x: 0,
  y: 0,
});
export const chatScaleAtom = atomWithStorage("chat-scale", 1);
export const chatShowSidebarAtom = atomWithStorage("chat-show-sidebar", false);

// Derived atom for position with dock
export const chatPositionWithDockAtom = atom((get) => {
  const position = get(chatPositionAtom);
  const isDocked = get(chatIsDockedAtom);

  if (!isDocked) return position;

  return {
    x: position.x === 0 ? 0 : window.innerWidth - 400,
    y: 0,
  };
});

// Message UI State Atoms
export const selectedMessageIdAtom = atom<string | null>(null);
export const editingMessageIdAtom = atom<string | null>(null);
export const isEditingAtom = atom<boolean>(false);
export const messageMenuOpenAtom = atom<Record<string, boolean>>({});
export const messageActionsVisibleAtom = atom<Record<string, boolean>>({});

// Form State Atom
export const formStateAtom = atom<{
  isSubmitting: boolean;
  error: string | null;
}>({
  isSubmitting: false,
  error: null,
});
