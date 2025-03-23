
import { create } from "zustand";
import { logger } from "@/services/chat/LoggingService";

export interface ChatState {
  isOpen: boolean;
  isHidden: boolean;
  docked: boolean;
  position: "bottom-right" | "bottom-left";
  messages: any[];
  loading: boolean;
  setIsOpen: (isOpen: boolean) => void;
  setIsHidden: (isHidden: boolean) => void;
  setDocked: (docked: boolean) => void;
  setPosition: (position: "bottom-right" | "bottom-left") => void;
  togglePosition: () => void;
}

// Initialize the chat store with proper default values
const initialState: Omit<ChatState, 
  'setIsOpen' | 'setIsHidden' | 'setDocked' | 'setPosition' | 'togglePosition'
> = {
  isOpen: false,
  isHidden: false, // Make sure this is explicitly set to false
  docked: false,
  position: "bottom-right",
  messages: [],
  loading: false,
};

export const useChatStore = create<ChatState>((set) => ({
  ...initialState,
  setIsOpen: (isOpen) => {
    logger.debug("Setting chat isOpen", { isOpen });
    set({ isOpen });
  },
  setIsHidden: (isHidden) => {
    logger.debug("Setting chat isHidden", { isHidden });
    set({ isHidden });
  },
  setDocked: (docked) => {
    logger.debug("Setting chat docked", { docked });
    set({ docked });
  },
  setPosition: (position) => {
    logger.debug("Setting chat position", { position });
    set({ position });
  },
  togglePosition: () => {
    set((state) => ({
      position: state.position === "bottom-right" ? "bottom-left" : "bottom-right",
    }));
  },
}));

// Initialize chat settings
export function initializeChatSettings() {
  logger.info("Initializing chat settings");
  // Additional initialization logic can go here
  return useChatStore.getState();
}
