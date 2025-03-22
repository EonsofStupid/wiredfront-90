import { ChatMode } from "@/types/chat";
import { StateCreator } from "zustand";
import { ChatState } from "../types";

export interface ModeSlice {
  // Mode state
  mode: {
    current: ChatMode;
    history: ChatMode[];
  };

  // Mode actions
  setMode: (mode: ChatMode) => void;
  getModeLabel: (mode: ChatMode) => string;
  getModeDescription: (mode: ChatMode) => string;
}

export const createModeSlice: StateCreator<ChatState, [], [], ModeSlice> = (
  set
) => ({
  // Default state
  mode: {
    current: "chat",
    history: [],
  },

  // Actions
  setMode: (mode) =>
    set((state) => ({
      mode: {
        current: mode,
        history: [...state.mode.history, state.mode.current],
      },
    })),

  getModeLabel: (mode) => {
    const labels: Record<ChatMode, string> = {
      chat: "Chat",
      code: "Code Assistant",
      assistant: "Assistant",
    };
    return labels[mode] || "Chat";
  },

  getModeDescription: (mode) => {
    const descriptions: Record<ChatMode, string> = {
      chat: "General chat mode",
      code: "Code assistance mode",
      assistant: "AI assistant mode",
    };
    return descriptions[mode] || "General chat mode";
  },
});
