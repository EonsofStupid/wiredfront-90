import { create } from "zustand";

export type ChatMode = "dev" | "image" | "training" | "docs";

interface ChatStore {
  isChatOpen: boolean;
  mode: ChatMode;
  activeProjectId: string | null;
  toggleChat: () => void;
  setMode: (mode: ChatMode) => void;
  setProjectId: (id: string) => void;
}

export const useChatStore = create<ChatStore>((set) => ({
  isChatOpen: false,
  mode: "dev",
  activeProjectId: null,
  toggleChat: () => set((s) => ({ isChatOpen: !s.isChatOpen })),
  setMode: (mode) => set({ mode }),
  setProjectId: (id) => set({ activeProjectId: id }),
}));
