
import { atom } from "jotai";
import { atomWithStorage } from "jotai/utils";
import { useChatStore } from "../store/chatStore";

// Temporary type until module is fixed
type ChatMode = "chat" | "search" | "settings";
type ChatPosition = "bottom-right" | "bottom-left" | "top-right" | "top-left";

// UI State Atoms
export const chatPositionAtom = atomWithStorage<ChatPosition>(
  "chat-position",
  "bottom-right"
);
export const chatScaleAtom = atomWithStorage<number>("chat-scale", 1);
export const isMinimizedAtom = atom<boolean>(false);
export const showSidebarAtom = atom<boolean>(true); // Setting this to true by default
export const currentModeAtom = atom<ChatMode>("chat");

// Sync with Zustand store
export const isChatVisibleAtom = atom(
  (get) => {
    const isMinimized = get(isMinimizedAtom);
    const showSidebar = get(showSidebarAtom);
    const { isHidden } = useChatStore.getState();
    return !isMinimized && showSidebar && !isHidden;
  },
  (get, set, isVisible: boolean) => {
    const { isHidden } = useChatStore.getState();
    if (isVisible) {
      set(showSidebarAtom, true);
      useChatStore.setState({ isHidden: false });
    } else {
      set(showSidebarAtom, false);
      useChatStore.setState({ isHidden: true });
    }
  }
);

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
