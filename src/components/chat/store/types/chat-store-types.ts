
import { Json } from '@/integrations/supabase/types';
import { 
  ChatMode, 
  ChatPosition, 
  ChatPositionCoordinates, 
  ChatPositionType
} from '@/types/chat/enums';

// Define Provider type 
export interface Provider {
  id: string;
  name: string;
  isEnabled: boolean;
  category: 'chat' | 'image' | 'audio' | 'video';
  models?: string[];
  maxTokens?: number;
  contextSize?: number;
  isDefault?: boolean;
}

export interface ChatState {
  initialized: boolean;
  messages: any[];
  userInput: string;
  isWaitingForResponse: boolean;
  selectedModel: string;
  selectedMode: string;
  modelFetchStatus: 'idle' | 'loading' | 'succeeded' | 'failed';
  error: string | null;
  chatId: string | null;
  docked: boolean;
  isOpen: boolean;
  isHidden: boolean;
  position: ChatPositionType;
  startTime: number;
  features: {
    voice: boolean;
    rag: boolean;
    modeSwitch: boolean;
    notifications: boolean;
    github: boolean;
    codeAssistant: boolean;
    ragSupport: boolean;
    githubSync: boolean;
    tokenEnforcement: boolean;
    [key: string]: boolean;
  };
  currentMode: ChatMode;
  availableProviders: Provider[];
  currentProvider: Provider | null;
  
  providers: {
    availableProviders: Provider[];
  };
  
  isMinimized: boolean;
  showSidebar: boolean;
  scale: number;
  ui: {
    sessionLoading: boolean;
    messageLoading: boolean;
    providerLoading: boolean;
  };
  
  // Required actions
  resetChatState: () => void;
  setUserInput: (input: string) => void;
}
