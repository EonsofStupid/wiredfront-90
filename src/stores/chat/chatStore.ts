import { create } from "zustand";
import { devtools, persist } from "zustand/middleware";
import { createFeatureSlice } from "./slice/featureSlice";
import { createLayoutSlice } from "./slice/layoutSlice";
import { createMessageSlice } from "./slice/messageSlice";
import { createModeSlice } from "./slice/modeSlice";
import { createPreferencesSlice } from "./slice/preferencesSlice";
import { createSessionSlice } from "./slice/sessionSlice";
import { createUISlice } from "./slice/uiSlice";
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
        ...createUISlice(...a),
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
          // UI state
          selectedMessageId: state.selectedMessageId,
          editingMessageId: state.editingMessageId,
          isEditing: state.isEditing,
          formState: state.formState,
          messageMenuOpen: state.messageMenuOpen,
          messageActionsVisible: state.messageActionsVisible,
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
