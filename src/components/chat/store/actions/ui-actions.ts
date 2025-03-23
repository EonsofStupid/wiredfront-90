import { supabase } from "@/integrations/supabase/client";
import { logger } from "@/services/chat/LoggingService";
import { StateCreator } from "zustand";
import {
  ChatPosition,
  ChatProvider,
  ChatState,
} from "../types/chat-store-types";

export interface UISlice {
  toggleMinimize: () => void;
  toggleSidebar: () => void;
  toggleChat: () => void;
  togglePosition: () => void;
  toggleDocked: () => void;
  showChat: () => void;
  setSessionLoading: (isLoading: boolean) => void;
  setMessageLoading: (isLoading: boolean) => void;
  setProviderLoading: (isLoading: boolean) => void;
  setScale: (scale: number) => void;
  setCurrentMode: (mode: "chat" | "dev" | "image") => void;
  updateCurrentProvider: (provider: ChatProvider) => void;
  updateAvailableProviders: (providers: ChatProvider[]) => void;
}

// Helper function to log provider changes to the database
const logProviderChange = async (
  oldProvider: string | undefined,
  newProvider: string | undefined
) => {
  if (!newProvider) return;

  try {
    const { data: userData } = await supabase.auth.getUser();
    if (!userData?.user) return;

    await supabase.from("provider_change_log").insert({
      user_id: userData.user.id,
      provider_name: newProvider,
      old_provider: oldProvider,
      new_provider: newProvider,
      reason: "user_action",
      metadata: { source: "client_app", action: "update_current_provider" },
    });

    logger.info(
      `Provider changed from ${oldProvider || "none"} to ${newProvider}`,
      {
        oldProvider,
        newProvider,
      }
    );
  } catch (error) {
    logger.error("Error logging provider change:", error);
  }
};

export const createUIActions: StateCreator<
  ChatState,
  [["zustand/devtools", never]],
  [],
  UISlice
> = (set, get) => ({
  toggleMinimize: () => {
    set(
      (state) => ({
        ...state,
        isMinimized: !state.isMinimized,
      }),
      false,
      { type: "ui/toggleMinimize" }
    );
  },
  toggleSidebar: () => {
    set(
      (state) => ({
        ...state,
        showSidebar: !state.showSidebar,
      }),
      false,
      { type: "ui/toggleSidebar" }
    );
  },
  toggleChat: () => {
    set(
      (state) => ({
        ...state,
        isOpen: !state.isOpen,
      }),
      false,
      { type: "ui/toggleChat" }
    );
  },
  togglePosition: () => {
    set(
      (state) => {
        if (typeof state.position === "string") {
          const positions: ChatPosition[] = [
            "bottom-right",
            "bottom-left",
            "top-right",
            "top-left",
          ];
          const currentIndex = positions.indexOf(
            state.position as ChatPosition
          );
          const nextIndex = (currentIndex + 1) % positions.length;
          return { ...state, position: positions[nextIndex] };
        }
        return { ...state, position: "bottom-right" };
      },
      false,
      { type: "ui/togglePosition" }
    );
  },
  toggleDocked: () => {
    set(
      (state) => ({
        ...state,
        docked: !state.docked,
      }),
      false,
      { type: "ui/toggleDocked" }
    );
  },
  showChat: () => {
    set(
      (state) => ({
        ...state,
        isHidden: false,
        isOpen: true,
      }),
      false,
      { type: "ui/showChat" }
    );
  },
  setSessionLoading: (isLoading: boolean) => {
    set(
      (state) => ({
        ...state,
        ui: {
          ...state.ui,
          sessionLoading: isLoading,
        },
      }),
      false,
      { type: "ui/setSessionLoading", isLoading }
    );
  },
  setMessageLoading: (isLoading: boolean) => {
    set(
      (state) => ({
        ...state,
        ui: {
          ...state.ui,
          messageLoading: isLoading,
        },
      }),
      false,
      { type: "ui/setMessageLoading", isLoading }
    );
  },
  setProviderLoading: (isLoading: boolean) => {
    set(
      (state) => ({
        ...state,
        ui: {
          ...state.ui,
          providerLoading: isLoading,
        },
      }),
      false,
      { type: "ui/setProviderLoading", isLoading }
    );
  },
  setScale: (scale: number) => {
    set(
      (state) => ({
        ...state,
        scale,
      }),
      false,
      { type: "ui/setScale", scale }
    );
  },
  setCurrentMode: (mode: "chat" | "dev" | "image") => {
    set(
      (state) => ({
        ...state,
        currentMode: mode,
      }),
      false,
      { type: "ui/setCurrentMode", mode }
    );
  },
  updateCurrentProvider: (provider: ChatProvider) => {
    set(
      (state) => {
        // Log provider change if it's different
        if (state.currentProvider?.id !== provider.id) {
          logProviderChange(state.currentProvider?.name, provider.name);
        }

        return {
          ...state,
          currentProvider: provider,
          providers: {
            ...state.providers,
            availableProviders:
              state.providers?.availableProviders.map((p) =>
                p.id === provider.id
                  ? { ...p, isDefault: true }
                  : { ...p, isDefault: false }
              ) || [],
          },
        };
      },
      false,
      { type: "ui/updateCurrentProvider", provider }
    );
  },
  updateAvailableProviders: (providers: ChatProvider[]) => {
    set(
      (state) => ({
        ...state,
        providers: {
          ...state.providers,
          availableProviders: providers,
        },
      }),
      false,
      { type: "ui/updateAvailableProviders", providers }
    );
  },
});

export type UIActions = ReturnType<typeof createUIActions>;
