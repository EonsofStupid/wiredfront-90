import { StateCreator } from "zustand";
import { ChatState } from "../types/state";

export interface LayoutSlice {
  // Layout state
  layout: {
    isSidebarOpen: boolean;
    isSettingsOpen: boolean;
    isMinimized: boolean;
    position: { x: number; y: number };
  };

  // Layout actions
  toggleSidebar: () => void;
  toggleSettings: () => void;
  toggleMinimize: () => void;
  setPosition: (position: { x: number; y: number }) => void;
}

export const createLayoutSlice: StateCreator<ChatState, [], [], LayoutSlice> = (
  set
) => ({
  // Default state
  layout: {
    isSidebarOpen: false,
    isSettingsOpen: false,
    isMinimized: false,
    position: { x: 20, y: 20 },
  },

  // Actions
  toggleSidebar: () =>
    set((state) => ({
      layout: {
        ...state.layout,
        isSidebarOpen: !state.layout.isSidebarOpen,
      },
    })),
  toggleSettings: () =>
    set((state) => ({
      layout: {
        ...state.layout,
        isSettingsOpen: !state.layout.isSettingsOpen,
      },
    })),
  toggleMinimize: () =>
    set((state) => ({
      layout: {
        ...state.layout,
        isMinimized: !state.layout.isMinimized,
      },
    })),
  setPosition: (position) =>
    set((state) => ({
      layout: {
        ...state.layout,
        position,
      },
    })),
});
