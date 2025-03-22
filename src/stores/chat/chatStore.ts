import { create } from "zustand";
import { devtools, persist } from "zustand/middleware";
import { createFeatureSlice } from "./slice/featureSlice";
import { createLayoutSlice } from "./slice/layoutSlice";
import { createMessageSlice } from "./slice/messageSlice";
import { createModeSlice } from "./slice/modeSlice";
import { createPreferencesSlice } from "./slice/preferencesSlice";
import { createSessionSlice } from "./slice/sessionSlice";
import { ChatState } from "./types";

/**
 * Main chat store with all slices combined
 * Uses Zustand middleware for persistence and dev tools
 */
export const useChatStore = create<ChatState>()(
  devtools(
    persist(
      (...a) => ({
        ...createFeatureSlice(...a),
        ...createLayoutSlice(...a),
        ...createMessageSlice(...a),
        ...createSessionSlice(...a),
        ...createModeSlice(...a),
        ...createPreferencesSlice(...a),
      }),
      {
        name: "chat-store",
        partialize: (state) => ({
          messages: state.messages,
          session: state.session,
          mode: state.mode,
          uiPreferences: state.uiPreferences,
          features: state.features,
        }),
      }
    )
  )
);

/**
 * Export selectors for common state slices
 */
export const useMessages = () => useChatStore((state) => state.messages);
export const useCurrentSession = () =>
  useChatStore((state) => state.session.current);
export const useSessionList = () => useChatStore((state) => state.session.list);
export const useUIPreferences = () =>
  useChatStore((state) => state.uiPreferences);
export const useFeatures = () => useChatStore((state) => state.features);
export const useChatMode = () => useChatStore((state) => state.mode.current);
export const useChatLayout = () => {
  const {
    layout,
    actions: { toggleSidebar, toggleSettings, toggleMinimize, setPosition },
  } = useChatStore();

  return {
    ...layout,
    toggleSidebar,
    toggleSettings,
    toggleMinimize,
    setPosition,
  };
};
