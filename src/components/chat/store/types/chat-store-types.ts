
import { Json } from '@/integrations/supabase/types';
import { 
  ChatMode, 
  ChatPosition, 
  ChatPositionCoordinates, 
  ChatPositionType,
  TokenEnforcementMode
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

export interface TokenControl {
  balance: number;
  enforcementMode: TokenEnforcementMode;
  lastUpdated: string;
  tokensPerQuery: number;
  freeQueryLimit: number;
  queriesUsed: number;
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
  
  tokenControl?: TokenControl;
  
  // Required actions
  resetChatState: () => void;
  setUserInput: (input: string) => void;
  
  // Optional UI actions
  toggleChat?: () => void;
  setSessionLoading?: (loading: boolean) => void;
  toggleSidebar?: () => void;
  
  // Feature actions
  setMode?: (mode: ChatMode | string) => void;
  setModel?: (model: string) => void;
  toggleFeature?: (key: keyof ChatState['features']) => void;
  setFeatureState?: (key: keyof ChatState['features'], value: boolean) => void;
  enableFeature?: (key: keyof ChatState['features']) => void;
  disableFeature?: (key: keyof ChatState['features']) => void;
  setPosition?: (position: ChatPositionType) => void;
  updateProviders?: (providers: Provider[]) => void;
  updateChatProvider?: (provider: Provider[]) => void;
}
