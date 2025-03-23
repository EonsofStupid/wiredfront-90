import { atom } from "jotai";
import { atomWithStorage } from "jotai/utils";
import { ChatMode, ChatPosition } from "../store/types/chat-store-types";

// UI State Atoms
export const chatPositionAtom = atomWithStorage<ChatPosition>(
  "chat-position",
  "bottom-right"
);
export const chatScaleAtom = atomWithStorage<number>("chat-scale", 1);
export const isMinimizedAtom = atom<boolean>(false);
export const showSidebarAtom = atom<boolean>(false);
export const currentModeAtom = atom<ChatMode>("standard");

// Derived Atoms
export const chatWindowStyleAtom = atom((get) => {
  const position = get(chatPositionAtom);
  const scale = get(chatScaleAtom);

  return {
    position,
    scale,
    transform: `scale(${scale})`,
  };
});

// Computed Atoms
export const isChatVisibleAtom = atom((get) => {
  const isMinimized = get(isMinimizedAtom);
  const showSidebar = get(showSidebarAtom);
  return !isMinimized && showSidebar;
});

// UI State Actions
export const toggleMinimizeAtom = atom(null, (get, set) =>
  set(isMinimizedAtom, !get(isMinimizedAtom))
);

export const toggleSidebarAtom = atom(null, (get, set) =>
  set(showSidebarAtom, !get(showSidebarAtom))
);

export const setChatPositionAtom = atom(
  null,
  (get, set, position: ChatPosition) => set(chatPositionAtom, position)
);

export const setChatScaleAtom = atom(null, (get, set, scale: number) =>
  set(chatScaleAtom, scale)
);

export const setCurrentModeAtom = atom(null, (get, set, mode: ChatMode) =>
  set(currentModeAtom, mode)
);
