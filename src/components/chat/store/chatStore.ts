
import { logger } from "@/services/chat/LoggingService";
import { create } from "zustand";
import { createCombinedStore } from "./index";
import { ChatState, UIStateActions } from "./types/chat-store-types";

type FullChatStore = ChatState &
  UIStateActions &
  ReturnType<typeof createCombinedStore>;

// Initialize the chat store with proper default values
const initialState: Omit<ChatState, keyof UIStateActions> = {
  initialized: false,
  messages: [],
  userInput: "",
  isWaitingForResponse: false,
  selectedModel: "gpt-4",
  selectedMode: "chat",
  modelFetchStatus: "idle",
  error: null,
  chatId: null,
  docked: false,
  isOpen: false,
  isHidden: false,
  position: "bottom-right",
  startTime: Date.now(),
  features: {
    voice: true,
    rag: true,
    modeSwitch: true,
    notifications: true,
    github: true,
    codeAssistant: true,
    ragSupport: true,
    githubSync: true,
    tokenEnforcement: false,
  },
  currentMode: "chat",
  availableProviders: [],
  currentProvider: null,
  tokenControl: {
    balance: 0,
    enforcementMode: "never",
    lastUpdated: null,
    tokensPerQuery: 1,
    freeQueryLimit: 5,
    queriesUsed: 0,
  },
  providers: {
    availableProviders: [],
  },
  isMinimized: false,
  showSidebar: false,
  scale: 1,
  ui: {
    sessionLoading: false,
    messageLoading: false,
    providerLoading: false,
  },
  resetChatState: () => {
    logger.info("Resetting chat state");
    // Implementation will be provided by the store
  },
  // Required for TypeScript, but will be implemented by the store
  togglePosition: () => {},
  toggleDocked: () => {},
  setIsHidden: () => {},
  updateCurrentProvider: () => {},
  updateAvailableProviders: () => {},
  addTokens: () => {},
  spendTokens: () => {},
  setTokenBalance: () => {},
  setTokenEnforcementMode: () => {},
};

export const useChatStore = create<FullChatStore>()((set, get, store) => ({
  ...initialState,
  ...createCombinedStore(set, get, store),
  
  // Implement UI actions directly here to ensure they're available
  toggleChat: () => {
    set((state) => ({ 
      isOpen: !state.isOpen,
      isMinimized: false // Reset minimized state when toggling
    }), false, "chat/toggleChat");
    logger.info("Chat toggled:", { isOpen: !get().isOpen });
  },
  
  toggleMinimize: () => {
    set((state) => ({ isMinimized: !state.isMinimized }), false, "chat/toggleMinimize");
    logger.info("Chat minimized state toggled:", { isMinimized: !get().isMinimized });
  },
  
  toggleSidebar: () => {
    set((state) => ({ showSidebar: !state.showSidebar }), false, "chat/toggleSidebar");
  },
  
  setSessionLoading: (isLoading) => {
    set((state) => ({ 
      ui: { ...state.ui, sessionLoading: isLoading } 
    }), false, "chat/setSessionLoading");
  },
  
  setMessageLoading: (isLoading) => {
    set((state) => ({ 
      ui: { ...state.ui, messageLoading: isLoading } 
    }), false, "chat/setMessageLoading");
  },
  
  setProviderLoading: (isLoading) => {
    set((state) => ({ 
      ui: { ...state.ui, providerLoading: isLoading } 
    }), false, "chat/setProviderLoading");
  },
  
  setScale: (scale) => {
    set({ scale }, false, "chat/setScale");
  },
  
  setCurrentMode: (mode) => {
    set({ currentMode: mode }, false, "chat/setCurrentMode");
  },
  
  setUserInput: (input) => {
    set({ userInput: input }, false, "chat/setUserInput");
  },
  
  // Ensure setIsHidden is implemented directly
  setIsHidden: (hidden) => {
    set({ isHidden: hidden }, false, "chat/setIsHidden");
    logger.info("Chat visibility updated:", { isHidden: hidden });
  },
}));

// Initialize chat settings
export function initializeChatSettings() {
  logger.info("Initializing chat settings");
  // Additional initialization logic can go here
  return useChatStore.getState();
}
