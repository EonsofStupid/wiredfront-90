import { StateCreator } from "zustand";

export interface CoreSlice {
  isChatOpen: boolean;
  activeProjectId: string | null;
  mode: "dev" | "image" | "training";
  sessionId: string | null;
  setMode: (mode: CoreSlice["mode"]) => void;
  setSessionId: (id: string | null) => void;
  toggleChat: () => void;
  setProjectId: (id: string | null) => void;
}

export const createCoreSlice: StateCreator<CoreSlice, [], [], CoreSlice> = (
  set
) => ({
  isChatOpen: false,
  activeProjectId: null,
  mode: "dev",
  sessionId: null,
  setMode: (mode) => set({ mode }),
  setSessionId: (id) => set({ sessionId: id }),
  toggleChat: () => set((state) => ({ isChatOpen: !state.isChatOpen })),
  setProjectId: (id) => set({ activeProjectId: id }),
});
