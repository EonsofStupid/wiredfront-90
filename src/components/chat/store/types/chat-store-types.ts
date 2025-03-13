import { ChatMessage } from "@/types/chat";

export interface ChatProvider {
  id: string;
  name: string;
  type: string;
  isDefault: boolean;
}

export interface ChatState {
  initialized: boolean;
  messages: ChatMessage[];
  userInput: string;
  isWaitingForResponse: boolean;
  selectedModel: string;
  selectedMode: string;
  modelFetchStatus: 'idle' | 'loading' | 'success' | 'error';
  error: string | null;
  chatId: string | null;
  docked: boolean;
  isOpen: boolean;
  isHidden: boolean;
  position: { x: number; y: number };
  startTime: number;
  features: {
    voice: boolean;
    rag: boolean;
    modeSwitch: boolean;
    notifications: boolean;
    github: boolean;
  };
  currentMode: 'chat' | 'dev' | 'image';
  availableProviders: ChatProvider[];
  currentProvider: ChatProvider | null;
}
