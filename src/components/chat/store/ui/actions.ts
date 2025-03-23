import { ChatMode } from "@/integrations/supabase/types/enums";
import { StateCreator } from "zustand";
import { ChatState, UIStateActions } from "../types/chat-store-types";

type UIStore = ChatState & UIStateActions;
type UISlice = Pick<UIStore, keyof UIStateActions>;

export const createUIActions: StateCreator<UIStore, [], [], UISlice> = (
  set,
  get
) => ({
  toggleMinimize: () => set({ isMinimized: !get().isMinimized }),
  toggleSidebar: () => set({ showSidebar: !get().showSidebar }),
  toggleChat: () => set({ isOpen: !get().isOpen }),

  setSessionLoading: (isLoading: boolean) =>
    set({ ui: { ...get().ui, sessionLoading: isLoading } }),

  setMessageLoading: (isLoading: boolean) =>
    set({ ui: { ...get().ui, messageLoading: isLoading } }),

  setProviderLoading: (isLoading: boolean) =>
    set({ ui: { ...get().ui, providerLoading: isLoading } }),

  setScale: (scale: number) => set({ scale }),

  setCurrentMode: (mode: ChatMode) => set({ currentMode: mode }),
});
