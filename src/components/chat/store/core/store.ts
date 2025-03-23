import { create } from "zustand";
import { devtools, DevtoolsOptions } from "zustand/middleware";
import { createFeatureActions } from "../features/actions";
import { ChatState } from "../types/chat-store-types";
import { createUIActions } from "../ui/actions";
import { createInitializationActions } from "./initialization";

// Define the full store type with all action slices
type FullChatStore = ChatState &
  ReturnType<typeof createInitializationActions> &
  ReturnType<typeof createFeatureActions> &
  ReturnType<typeof createUIActions>;

type StoreMiddlewares = [];
type StoreDevtools = [];

const initialState: Omit<ChatState, "resetChatState"> = {
  initialized: false,
  messages: [],
  userInput: "",
  isWaitingForResponse: false,
  selectedModel: "gpt-4",
  selectedMode: "chat",
  modelFetchStatus: "idle",
  error: null,
  chatId: null,
  docked: true,
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
};

// Enhanced function to clear all Zustand middleware storage
export const clearMiddlewareStorage = () => {
  try {
    console.log("🧹 Starting complete middleware storage cleanup");

    // 1. Clear localStorage items
    const allKeys = Object.keys(localStorage);
    const zustandKeys = allKeys.filter(
      (key) =>
        key.includes("zustand") ||
        key.includes("chat-") ||
        key.includes("provider-") ||
        key.includes("session-") ||
        key.startsWith("persist:")
    );

    zustandKeys.forEach((key) => {
      localStorage.removeItem(key);
      console.log(`Removed storage key: ${key}`);
    });

    // 2. Clear sessionStorage items
    const sessionKeys = Object.keys(sessionStorage);
    const zustandSessionKeys = sessionKeys.filter(
      (key) =>
        key.includes("zustand") ||
        key.includes("chat-") ||
        key.includes("provider-") ||
        key.includes("session-")
    );

    zustandSessionKeys.forEach((key) => {
      sessionStorage.removeItem(key);
      console.log(`Removed session storage key: ${key}`);
    });

    // 3. Attempt to clear IndexedDB if available
    if (window.indexedDB) {
      try {
        const dbNames = [
          "zustand-persist",
          "zustand-chat",
          "chat-sessions",
          "chat-providers",
          "message-cache",
        ];

        dbNames.forEach((dbName) => {
          const request = window.indexedDB.deleteDatabase(dbName);
          request.onsuccess = () => console.log(`Deleted IndexedDB: ${dbName}`);
          request.onerror = () =>
            console.error(`Failed to delete IndexedDB: ${dbName}`);
        });
      } catch (idbError) {
        console.error("Error clearing IndexedDB:", idbError);
      }
    }

    return true;
  } catch (e) {
    console.error("Error clearing middleware storage:", e);
    return false;
  }
};

type StoreWithDevtools = ReturnType<typeof devtools<FullChatStore>>;

export const useChatStore = create<FullChatStore>()(
  devtools(
    (set, get, store) => ({
      ...initialState,

      resetChatState: () => {
        clearMiddlewareStorage();

        set(
          {
            ...initialState,
            initialized: true,
            availableProviders: get().availableProviders,
            currentProvider: get().currentProvider,
            features: get().features,
          },
          false,
          "chat/resetState"
        );
      },

      ...createInitializationActions(set, get, store),
      ...createFeatureActions(set, get, store),
      ...createUIActions(set, get, store),
    }),
    {
      name: "ChatStore",
      enabled: process.env.NODE_ENV !== "production",
    } as DevtoolsOptions
  )
);
