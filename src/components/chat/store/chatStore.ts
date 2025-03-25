import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import { v4 as uuidv4 } from 'uuid';
import { createInitializationActions } from './actions/initialization-actions';
import { createFeatureActions } from './actions/feature';
import { createUIActions } from './actions/ui-actions';
import { ChatState, FeatureState, Providers, TokenControl } from './types/chat-store-types';
import { Message } from '@/types/chat';
import { getChatSettings, saveChatSettings, ChatSettings } from '@/utils/storage/chat-settings';
import { TokenEnforcementMode } from '@/integrations/supabase/types/enums';
import { ProviderCategory } from '@/types/providers';

type FullChatStore = ChatState & 
  ReturnType<typeof createInitializationActions> & 
  ReturnType<typeof createFeatureActions> & 
  ReturnType<typeof createUIActions>;

const noop = () => {};
const asyncNoop = async () => false;

const initialState: Omit<ChatState, keyof FeatureState | keyof Providers | keyof TokenControl> = {
  initialized: false,
  isOpen: false,
  isMinimized: false,
  isHidden: false,
  position: 'bottom-right',
  currentMode: 'chat',
  features: {
    voice: false,
    rag: false,
    modeSwitch: false,
    github: false,
    codeAssistant: false,
    ragSupport: false,
    githubSync: false,
    notifications: false,
    tokenEnforcement: false,
  },
  settings: getChatSettings(),
  docked: false,
  scale: 1,
  showSidebar: false,
  messages: [],
  userInput: '',
  isWaitingForResponse: false,
  selectedModel: '',
  selectedMode: '',
  modelFetchStatus: 'idle',
  error: null,
  chatId: null,
  startTime: Date.now(),
  availableProviders: [],
  currentProvider: null,
  tokenControl: {
    mode: 'NONE',
    balance: 0,
  },
  providers: {
    loading: false,
    error: null,
  },
  ui: {
    sessionLoading: false,
    messageLoading: false,
    providerLoading: false,
  },
};

export const clearMiddlewareStorage = () => {
  try {
    console.log("🧹 Starting complete middleware storage cleanup");
    
    const allKeys = Object.keys(localStorage);
    const zustandKeys = allKeys.filter(key => 
      key.includes('zustand') || 
      key.includes('chat-') || 
      key.includes('provider-') || 
      key.includes('session-') ||
      key.startsWith('persist:')
    );
    
    console.log(`Found ${zustandKeys.length} Zustand-related localStorage keys to remove`);
    zustandKeys.forEach(key => {
      localStorage.removeItem(key);
      console.log(`Removed storage key: ${key}`);
    });
    
    const sessionKeys = Object.keys(sessionStorage);
    const zustandSessionKeys = sessionKeys.filter(key => 
      key.includes('zustand') || 
      key.includes('chat-') || 
      key.includes('provider-') ||
      key.includes('session-')
    );
    
    zustandSessionKeys.forEach(key => {
      sessionStorage.removeItem(key);
      console.log(`Removed session storage key: ${key}`);
    });
    
    if (window.indexedDB) {
      try {
        const dbNames = [
          'zustand-persist', 
          'zustand-chat', 
          'chat-sessions', 
          'chat-providers',
          'message-cache'
        ];
        
        dbNames.forEach(dbName => {
          const request = window.indexedDB.deleteDatabase(dbName);
          request.onsuccess = () => console.log(`Deleted IndexedDB: ${dbName}`);
          request.onerror = () => console.error(`Failed to delete IndexedDB: ${dbName}`);
        });
      } catch (idbError) {
        console.error('Error clearing IndexedDB:', idbError);
      }
    }
    
    console.log('Middleware storage cleanup completed');
    return true;
  } catch (e) {
    console.error('Error clearing middleware storage:', e);
    return false;
  }
};

export const useChatStore = create<ChatState>((set) => ({
  ...initialState,
  toggleChat: () => set((state) => ({ isOpen: !state.isOpen })),
  toggleMinimize: () => set((state) => ({ isMinimized: !state.isMinimized })),
  togglePosition: () => set((state) => {
    const newPosition = state.position === 'bottom-right' ? 'bottom-left' : 'bottom-right';
    return { position: newPosition };
  }),
  setCurrentMode: (mode) => set({ currentMode: mode }),
  toggleFeature: (feature) => set((state) => ({
    features: {
      ...state.features,
      [feature]: !state.features[feature],
    },
  })),
  updateSettings: (newSettings) => set((state) => {
    const updatedSettings = {
      ...state.settings,
      ...newSettings,
    };
    saveChatSettings(updatedSettings);
    return { settings: updatedSettings };
  }),
  resetSettings: () => {
    const defaultSettings = getChatSettings();
    saveChatSettings(defaultSettings);
    set({ settings: defaultSettings });
  },
  toggleDocked: () => set((state) => ({ docked: !state.docked })),
  setScale: (scale) => set({ scale }),
  setUserInput: (input) => set({ userInput: input }),
  addMessage: (message) => set((state) => ({ messages: [...state.messages, message] })),
  updateMessage: (id, updates) => set((state) => ({
    messages: state.messages.map((msg) => (msg.id === id ? { ...msg, ...updates } : msg)),
  })),
  resetChatState: () => set((state) => ({ messages: [] })),
  setAvailableProviders: (providers) => set({ availableProviders: providers }),
  setCurrentProvider: (provider) => set({ currentProvider: provider }),
  setTokenEnforcementMode: (mode) => set((state) => ({
    tokenControl: { ...state.tokenControl, mode },
  })),
  addTokens: async (amount) => {
    set((state) => ({
      tokenControl: {
        ...state.tokenControl,
        balance: state.tokenControl.balance + amount,
      },
    }));
    return true;
  },
  spendTokens: async (amount) => {
    set((state) => ({
      tokenControl: {
        ...state.tokenControl,
        balance: state.tokenControl.balance - amount,
      },
    }));
    return true;
  },
  setTokenBalance: async (amount) => {
    set((state) => ({
      tokenControl: {
        ...state.tokenControl,
        balance: amount,
      },
    }));
    return true;
  },
  initializeChatSettings: () => {
    const settings = getChatSettings();
    set({ settings, initialized: true });
  },
  setSessionLoading: (isLoading: boolean) => set((state) => ({
    ui: {
      ...state.ui,
      sessionLoading: isLoading,
    }
  })),
}));
