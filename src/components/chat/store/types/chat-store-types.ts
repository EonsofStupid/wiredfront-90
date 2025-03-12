
import { ChatProviderType } from '@/types/admin/settings/chat-provider';

export type ChatPosition = 'bottom-right' | 'bottom-left';

export interface ChatState {
  position: ChatPosition;
  isMinimized: boolean;
  showSidebar: boolean;
  isOpen: boolean;
  scale: number;
  docked: boolean;
  isInitialized: boolean;
  features: {
    codeAssistant: boolean;
    ragSupport: boolean;
    githubSync: boolean;
    notifications: boolean;
  };
  providers: {
    currentProvider: ChatProviderType;
    availableProviders: {
      id: string;
      type: ChatProviderType;
      name: string;
      isEnabled: boolean;
    }[];
  };
}

export interface ChatActions {
  togglePosition: () => void;
  toggleMinimize: () => void;
  toggleSidebar: () => void;
  toggleChat: () => void;
  setScale: (scale: number) => void;
  toggleDocked: () => void;
  toggleFeature: (feature: keyof ChatState['features']) => void;
  setCurrentProvider: (providerId: string) => void;
  toggleProviderEnabled: (providerId: string) => void;
  initializeChatSettings: () => void;
}
