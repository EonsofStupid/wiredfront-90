import { create } from "zustand";
import { devtools, persist } from "zustand/middleware";
import { createFeatureSlice } from "./slice/featureSlice";
import { createLayoutSlice } from "./slice/layoutSlice";
import { createMessageSlice } from "./slice/messageSlice";
import { createModeSlice } from "./slice/modeSlice";
import { createPreferencesSlice } from "./slice/preferencesSlice";
import { createSessionSlice } from "./slice/sessionSlice";
import { ChatState } from "./types/state";

/**
 * Main chat store with all slices combined
 * Uses Zustand middleware for persistence and dev tools
 */
export const useChatStore = create<ChatState>()(
  devtools(
    persist(
      (...a) => ({
        ...createMessageSlice(...a),
        ...createSessionSlice(...a),
        ...createModeSlice(...a),
        ...createPreferencesSlice(...a),
        ...createLayoutSlice(...a),
        ...createFeatureSlice(...a),
      }),
      {
        name: "chat-storage",
        partialize: (state) => ({
          messages: {
            list: state.messages.list,
            isLoading: state.messages.isLoading,
            error: state.messages.error,
          },
          session: {
            current: state.session.current,
            list: state.session.list,
            isLoading: state.session.isLoading,
            error: state.session.error,
          },
          mode: {
            current: state.mode.current,
            history: state.mode.history,
          },
          uiPreferences: {
            messageBehavior: state.uiPreferences.messageBehavior,
            notifications: state.uiPreferences.notifications,
            soundEnabled: state.uiPreferences.soundEnabled,
            typingIndicators: state.uiPreferences.typingIndicators,
          },
          layout: {
            isSidebarOpen: state.layout.isSidebarOpen,
            isSettingsOpen: state.layout.isSettingsOpen,
            isMinimized: state.layout.isMinimized,
            position: state.layout.position,
          },
          features: state.features,
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
