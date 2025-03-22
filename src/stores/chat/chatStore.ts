import { create } from "zustand";
import { devtools, persist } from "zustand/middleware";
import { ChatState } from "./types/state";

export type ChatMode = "dev" | "image" | "training";

interface ChatState {
  // Global app-level state
  isOpen: boolean;
  projectId: string | null;
  mode: ChatMode;
  sessionId: string | null;

  // Analytics and tracking
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
 * Main chat store with all slices combined
 * Uses Zustand middleware for persistence and dev tools
 */
export const useChatStore = create<ChatState>()(
  devtools(
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
  )
);

/**
 * Export selectors for common state slices
 */
export const useMessages = () => useChatStore((state) => state.messages.list);
export const useCurrentSession = () =>
  useChatStore((state) => state.session.current);
export const useSessionList = () => useChatStore((state) => state.session.list);
export const useUIPreferences = () =>
  useChatStore((state) => state.uiPreferences);
export const useFeatures = () => useChatStore((state) => state.features);
export const useChatMode = () => useChatStore((state) => state.mode.current);
export const useChatLayout = () => {
  const { layout, toggleSidebar, toggleSettings, toggleMinimize, setPosition } =
    useChatStore();

  return {
    ...layout,
    toggleSidebar,
    toggleSettings,
    toggleMinimize,
    setPosition,
  };
};

// UI state selectors
export const useSelectedMessage = () =>
  useChatStore((state) => state.selectedMessageId);
export const useEditingMessage = () =>
  useChatStore((state) => state.editingMessageId);
export const useIsEditing = () => useChatStore((state) => state.isEditing);
export const useFormState = () => useChatStore((state) => state.formState);
export const useMessageMenu = (messageId: string) =>
  useChatStore((state) => state.messageMenuOpen[messageId]);
export const useMessageActions = (messageId: string) =>
  useChatStore((state) => state.messageActionsVisible[messageId]);
