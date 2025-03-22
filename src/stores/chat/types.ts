import { ChatMode, ChatSession, Message } from "@/types/chat";
import { FeatureState } from "@/types/chat/features";
import { SessionListItem } from "@/types/chat/sessions";

/**
 * Complete chat state type definition combining all slices
 */
export interface ChatState extends FeatureState {
  // Layout state
  layout: {
    isSidebarOpen: boolean;
    isSettingsOpen: boolean;
    isMinimized: boolean;
    position: { x: number; y: number };
  };
  // Message state
  messages: {
    list: Message[];
    isLoading: boolean;
    error: string | null;
  };
  // Session state
  session: {
    current: ChatSession | null;
    list: SessionListItem[];
    isLoading: boolean;
    error: string | null;
  };
  // Mode state
  mode: {
    current: ChatMode;
    history: ChatMode[];
  };
  // UI preferences
  uiPreferences: {
    messageBehavior: {
      autoScroll: boolean;
      showTimestamps: boolean;
    };
    notifications: {
      enabled: boolean;
      sound: boolean;
    };
    soundEnabled: boolean;
    typingIndicators: boolean;
  };
  // Actions
  actions: {
    // Layout actions
    toggleSidebar: () => void;
    toggleSettings: () => void;
    toggleMinimize: () => void;
    setPosition: (position: { x: number; y: number }) => void;
    // Message actions
    addMessage: (message: Message) => void;
    updateMessage: (id: string, message: Partial<Message>) => void;
    deleteMessage: (id: string) => void;
    clearMessages: () => void;
    setMessages: (messages: Message[]) => void;
    // Session actions
    setCurrentSession: (session: ChatSession | null) => void;
    setSessionList: (sessions: SessionListItem[]) => void;
    setIsSessionLoading: (isLoading: boolean) => void;
    setSessionError: (error: string | null) => void;
    // Mode actions
    setMode: (mode: ChatMode) => void;
    // UI preference actions
    setMessageBehavior: (behavior: {
      autoScroll?: boolean;
      showTimestamps?: boolean;
    }) => void;
    setNotificationSettings: (settings: {
      enabled?: boolean;
      sound?: boolean;
    }) => void;
    setSoundEnabled: (enabled: boolean) => void;
    setTypingIndicators: (enabled: boolean) => void;
  };
}
