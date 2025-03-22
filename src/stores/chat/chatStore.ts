import { ChatMode } from "@/types/chat";
import { create } from "zustand";
import { persist } from "zustand/middleware";

interface ChatState {
  // Global state (persisted)
  isOpen: boolean;
  projectId: string | null;
  mode: ChatMode;
  sessionId: string | null;

  // Cost tracking (persisted)
  costTracking: {
    currentSession: number;
    total: number;
  };

  // Actions
  setMode: (mode: ChatMode) => void;
  setSessionId: (id: string | null) => void;
  toggleChat: () => void;
  setProjectId: (id: string | null) => void;
  updateCost: (amount: number) => void;
}

/**
 * Main chat store with global app-level state
 * Uses Zustand middleware for persistence and dev tools
 */
export const useChatStore = create<ChatState>()(
  persist(
    (set) => ({
      // Initial state
      isOpen: false,
      projectId: null,
      mode: "dev",
      sessionId: null,
      costTracking: {
        currentSession: 0,
        total: 0,
      },

      // Actions
      setMode: (mode) => set({ mode }),
      setSessionId: (id) => set({ sessionId: id }),
      toggleChat: () => set((state) => ({ isOpen: !state.isOpen })),
      setProjectId: (id) => set({ projectId: id }),
      updateCost: (amount) =>
        set((state) => ({
          costTracking: {
            currentSession: state.costTracking.currentSession + amount,
            total: state.costTracking.total + amount,
          },
        })),
    }),
    {
      name: "chat-storage",
      partialize: (state) => ({
        projectId: state.projectId,
        mode: state.mode,
        costTracking: state.costTracking,
      }),
    }
  )
);

// Export simple selectors for the global state
export const useChatOpen = () => useChatStore((state) => state.isOpen);
export const useProjectId = () => useChatStore((state) => state.projectId);
export const useChatMode = () => useChatStore((state) => state.mode);
export const useSessionId = () => useChatStore((state) => state.sessionId);
export const useCostTracking = () =>
  useChatStore((state) => state.costTracking);
