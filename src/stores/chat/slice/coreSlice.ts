import { ChatMode } from "@/types/chat/modes";
import { StateCreator } from "zustand";
import { ChatState } from "../types/state";

interface ChatModeState {
  current: ChatMode;
  history: ChatMode[];
}

export interface CoreSlice {
  isChatOpen: boolean;
  activeProjectId: string | null;
  mode: ChatModeState;
  sessionId: string | null;
  setMode: (mode: ChatMode) => void;
  setSessionId: (id: string | null) => void;
  toggleChat: () => void;
  setProjectId: (id: string | null) => void;
}

export const createCoreSlice: StateCreator<ChatState, [], [], CoreSlice> = (
  set
) => ({
  isChatOpen: false,
  activeProjectId: null,
  mode: {
    current: "dev",
    history: [],
  },
  sessionId: null,
  setMode: (mode) =>
    set((state) => ({
      mode: {
        current: mode,
        history: [...state.mode.history, mode],
      },
    })),
  setSessionId: (id) => set({ sessionId: id }),
  toggleChat: () => set((state) => ({ isChatOpen: !state.isChatOpen })),
  setProjectId: (id) => set({ activeProjectId: id }),
});
