import { logger } from "@/services/chat/LoggingService";
import { create } from "zustand";
import { createInitializationActions } from "./core/initialization";
import { createFeatureActions } from "./features/actions";
import { ChatState, UIStateActions } from "./types/chat-store-types";
import { createUIActions } from "./ui/actions";

type FullChatStore = ChatState &
  UIStateActions &
  ReturnType<typeof createInitializationActions> &
  ReturnType<typeof createFeatureActions>;

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
    // Additional reset logic can go here
  },
};

export const useChatStore = create<FullChatStore>()((set, get, store) => ({
  ...initialState,
  ...createInitializationActions(set, get, store),
  ...createFeatureActions(set, get, store),
  ...createUIActions(set, get, store),
}));

// Initialize chat settings
export function initializeChatSettings() {
  logger.info("Initializing chat settings");
  // Additional initialization logic can go here
  return useChatStore.getState();
}
