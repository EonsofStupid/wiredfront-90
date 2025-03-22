import type { Message } from "@/types/chat/messages";
import { atom, Getter, Setter } from "jotai";
import { atomWithStorage } from "jotai/utils";

// Storage key constants
const STORAGE_KEYS = {
  MESSAGES: "chat-messages",
  IS_TYPING: "chat-is-typing",
  ERROR: "chat-error",
} as const;

// Base atoms
export const messagesAtom = atomWithStorage<Message[]>(
  STORAGE_KEYS.MESSAGES,
  []
);
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
  (
    get: Getter,
    set: Setter,
    { id, content }: { id: string; content: string }
  ) => {
    const currentMessages = get(messagesAtom);
    set(
      messagesAtom,
      currentMessages.map((msg) => (msg.id === id ? { ...msg, content } : msg))
    );
  }
);

export const removeMessageAtom = atom(
  null,
  (get: Getter, set: Setter, id: string) => {
    const currentMessages = get(messagesAtom);
    set(
      messagesAtom,
      currentMessages.filter((msg) => msg.id !== id)
    );
  }
);

export const clearMessagesAtom = atom(null, (_: Getter, set: Setter) => {
  set(messagesAtom, []);
});

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

// UI State Atoms
export const isMinimizedAtom = atomWithStorage("chat-ui-minimized", false);
export const showSidebarAtom = atomWithStorage("chat-ui-sidebar", true);
export const scaleAtom = atomWithStorage("chat-ui-scale", 1);
export const positionAtom = atomWithStorage("chat-ui-position", { x: 0, y: 0 });
export const dockedAtom = atomWithStorage("chat-ui-docked", true);

// Input State Atoms
export const userInputAtom = atom("");
export const isWaitingForResponseAtom = atom(false);

// Feature State Atoms
export const showTimestampsAtom = atomWithStorage("chat-ui-timestamps", true);
export const startMinimizedAtom = atomWithStorage(
  "chat-ui-start-minimized",
  false
);

// Derived Atoms
export const isMaximizedAtom = atom((get) => !get(isMinimizedAtom));
export const isFloatingAtom = atom((get) => !get(dockedAtom));
export const isVisibleAtom = atom(
  (get) => !get(isMinimizedAtom) && !get(isHiddenAtom)
);
export const isHiddenAtom = atomWithStorage("chat-ui-hidden", false);

// UI Loading States
export const sessionLoadingAtom = atom(false);
export const messageLoadingAtom = atom(false);
export const providerLoadingAtom = atom(false);

// UI Error States
export const modelFetchStatusAtom = atom<
  "idle" | "loading" | "success" | "error"
>("idle");

// Input state
export const messageInputAtom = atom("");
export const isComposingAtom = atom(false);

// UI toggles
export const isEmojiPickerOpenAtom = atom(false);
export const isMarkdownPreviewOpenAtom = atom(false);
export const selectedMessageIdAtom = atom<string | null>(null);

// Streaming state
export const isStreamingAtom = atom(false);
export const streamProgressAtom = atom(0);

// Form state
export const formStateAtom = atom({
  isSubmitting: false,
  isDirty: false,
  error: null as string | null,
});

// Local UI preferences (persisted)
export const uiPreferencesAtom = atomWithStorage("chat-ui-preferences", {
  fontSize: "medium",
  messageBehavior: "enter_send",
  showTimestamps: true,
  scrollBehavior: "smooth",
});

// Message list UI state
export const scrollPositionAtom = atom(0);
export const visibleMessagesAtom = atom<string[]>([]);

// Local component state
export const hoveredMessageIdAtom = atom<string | null>(null);
export const focusedElementAtom = atom<string | null>(null);
