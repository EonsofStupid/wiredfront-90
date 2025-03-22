import { atom } from "jotai";
import { atomWithStorage } from "jotai/utils";

// Message UI state
export const messageInputAtom = atom("");
export const selectedMessageIdAtom = atom<string | null>(null);
export const editingMessageIdAtom = atom<string | null>(null);
export const streamingAtom = atom(false);

// UI toggles and visibility
export const isEmojiPickerOpenAtom = atom(false);
export const isMarkdownPreviewOpenAtom = atom(false);
export const messageMenuOpenAtom = atom<Record<string, boolean>>({});
export const messageActionsVisibleAtom = atom<Record<string, boolean>>({});

// Layout preferences (persisted)
export const layoutPreferencesAtom = atomWithStorage(
  "chat-layout-preferences",
  {
    isSidebarOpen: true,
    isSettingsOpen: false,
    isMinimized: false,
    position: { x: 0, y: 0 },
  }
);

// UI preferences (persisted)
export const uiPreferencesAtom = atomWithStorage("chat-ui-preferences", {
  messageBehavior: "instant",
  notifications: true,
  soundEnabled: true,
  typingIndicators: true,
});

// Form state
export const formStateAtom = atom<{
  isSubmitting: boolean;
  error: string | null;
}>({
  isSubmitting: false,
  error: null,
});
