import { Message } from "@/types/chat/messages";
import { StateCreator } from "zustand";
import { ChatState } from "../types";

export const createMessageSlice: StateCreator<ChatState> = (set) => ({
  // Feature state
  features: {
    enableCodeCompletion: false,
    enableCodeExplanation: false,
    enableCodeGeneration: false,
    enableCodeReview: false,
    enableCodeSearch: false,
    enableDocumentation: false,
    enableErrorAnalysis: false,
    enableRefactoring: false,
    enableTesting: false,
    enableTranslation: false,
  },

  // Feature actions
  toggleFeature: () => {},
  enableFeature: () => {},
  disableFeature: () => {},
  setFeatureState: () => {},

  // Layout state
  layout: {
    isSidebarOpen: false,
    isSettingsOpen: false,
    isMinimized: false,
    position: { x: 0, y: 0 },
  },

  // Message state
  messages: {
    list: [],
    isLoading: false,
    error: null,
  },

  // Session state
  session: {
    current: null,
    list: [],
    isLoading: false,
    error: null,
  },

  // Mode state
  mode: {
    current: "chat",
    history: [],
  },

  // UI preferences
  uiPreferences: {
    messageBehavior: {
      autoScroll: true,
      showTimestamps: false,
    },
    notifications: {
      enabled: true,
      sound: true,
    },
    soundEnabled: true,
    typingIndicators: true,
  },

  actions: {
    // Layout actions
    toggleSidebar: () => {},
    toggleSettings: () => {},
    toggleMinimize: () => {},
    setPosition: () => {},

    // Message actions
    addMessage: (message: Message) =>
      set((state) => ({
        messages: {
          ...state.messages,
          list: [...state.messages.list, message],
        },
      })),
    updateMessage: (id: string, message: Partial<Message>) =>
      set((state) => ({
        messages: {
          ...state.messages,
          list: state.messages.list.map((m) =>
            m.id === id ? { ...m, ...message } : m
          ),
        },
      })),
    deleteMessage: (id: string) =>
      set((state) => ({
        messages: {
          ...state.messages,
          list: state.messages.list.filter((m) => m.id !== id),
        },
      })),
    clearMessages: () =>
      set((state) => ({
        messages: {
          ...state.messages,
          list: [],
        },
      })),
    setMessages: (messages: Message[]) =>
      set((state) => ({
        messages: {
          ...state.messages,
          list: messages,
        },
      })),

    // Session actions
    setCurrentSession: () => {},
    setSessionList: () => {},
    setIsSessionLoading: () => {},
    setSessionError: () => {},

    // Mode actions
    setMode: () => {},

    // UI preference actions
    setMessageBehavior: () => {},
    setNotificationSettings: () => {},
    setSoundEnabled: () => {},
    setTypingIndicators: () => {},
  },
});
