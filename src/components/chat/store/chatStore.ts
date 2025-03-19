import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import { v4 as uuidv4 } from 'uuid';
import { createInitializationActions } from './actions/initialization-actions';
import { createFeatureActions } from './actions/feature';
import { createUIActions } from './actions/ui-actions';
import { ChatState, ProviderCategory, ChatMode, FeatureState } from './types/chat-store-types';
import { Message } from '@/types/chat';

type FullChatStore = ChatState & 
  ReturnType<typeof createInitializationActions> & 
  ReturnType<typeof createFeatureActions> & 
  ReturnType<typeof createUIActions>;

const noop = () => {};
const asyncNoop = async () => false;

const initialState: ChatState = {
  initialized: false,
  messages: [],
  userInput: '',
  isWaitingForResponse: false,
  selectedModel: 'gpt-4',
  selectedMode: 'chat',
  modelFetchStatus: 'idle',
  error: null,
  chatId: null,
  docked: true,
  isOpen: false,
  isHidden: false,
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
    startMinimized: false,
    showTimestamps: true,
    saveHistory: true,
  },
  currentMode: 'chat',
  availableProviders: [],
  currentProvider: null,
  
  tokenControl: {
    balance: 0,
    enforcementMode: 'never',
    lastUpdated: null,
    tokensPerQuery: 1,
    freeQueryLimit: 5,
    queriesUsed: 0
  },
  
  providers: {
    availableProviders: [],
    currentProvider: null,
    error: null
  },
  
  isMinimized: false,
  showSidebar: false,
  scale: 1,
  ui: {
    sessionLoading: false,
    messageLoading: false,
    providerLoading: false,
  },
  
  addMessage: noop,
  updateMessage: noop,
  resetChatState: noop,
  setUserInput: noop,
  toggleDocked: noop,
  setScale: noop,
  setCurrentMode: noop,
  updateCurrentProvider: noop,
  updateAvailableProviders: noop,
  updateChatProvider: noop,
  toggleFeature: noop,
  enableFeature: noop,
  disableFeature: noop,
  setFeatureState: noop,
  setTokenEnforcementMode: noop,
  addTokens: asyncNoop,
  spendTokens: asyncNoop,
  setTokenBalance: asyncNoop,
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

export const useChatStore = create<FullChatStore>()(
  devtools(
    (set, get) => ({
      ...initialState,
      
      resetChatState: () => {
        clearMiddlewareStorage();
        
        set({
          ...initialState,
          initialized: true,
          availableProviders: get().availableProviders,
          currentProvider: get().currentProvider,
          features: get().features,
        }, false, { type: 'chat/resetState' });
      },
      
      setUserInput: (input: string) => {
        set({ userInput: input }, false, { type: 'chat/setUserInput' });
      },
      
      addMessage: (message: Message) => {
        set(state => ({
          messages: [...state.messages, {
            id: message.id || uuidv4(),
            timestamp: new Date().toISOString(),
            ...message,
          }]
        }), false, { type: 'chat/addMessage' });
      },
      
      updateMessage: (id: string, updates: Partial<Message>) => {
        set(state => ({
          messages: state.messages.map(msg => 
            msg.id === id ? { ...msg, ...updates } : msg
          )
        }), false, { type: 'chat/updateMessage' });
      },
      
      toggleDocked: () => {
        set(state => ({
          docked: !state.docked
        }), false, { type: 'chat/toggleDocked' });
      },
      
      setScale: (scale: number) => {
        set({ scale }, false, { type: 'chat/setScale' });
      },
      
      setCurrentMode: (mode: ChatMode) => {
        set({ currentMode: mode }, false, { type: 'chat/setCurrentMode', mode });
      },
      
      updateCurrentProvider: (provider: ProviderCategory) => {
        set({ currentProvider: provider }, false, { type: 'chat/updateCurrentProvider', provider });
      },
      
      updateAvailableProviders: (providers: ProviderCategory[]) => {
        set({ availableProviders: providers }, false, { type: 'chat/updateAvailableProviders', providers });
      },
      
      updateChatProvider: (providers: ProviderCategory[]) => {
        set({ availableProviders: providers }, false, { type: 'chat/updateChatProvider', providers });
      },
      
      toggleFeature: (featureName: keyof FeatureState) => {
        set(state => ({
          features: {
            ...state.features,
            [featureName]: !state.features[featureName],
          },
        }), false, { type: 'chat/toggleFeature', feature: featureName });
      },
      
      enableFeature: (featureName: keyof FeatureState) => {
        set(state => ({
          features: {
            ...state.features,
            [featureName]: true,
          },
        }), false, { type: 'chat/enableFeature', feature: featureName });
      },
      
      disableFeature: (featureName: keyof FeatureState) => {
        set(state => ({
          features: {
            ...state.features,
            [featureName]: false,
          },
        }), false, { type: 'chat/disableFeature', feature: featureName });
      },
      
      setFeatureState: (featureName: keyof FeatureState, isEnabled: boolean) => {
        set(state => ({
          features: {
            ...state.features,
            [featureName]: isEnabled,
          },
        }), false, { type: 'chat/setFeatureState', feature: featureName, isEnabled });
      },
      
      setTokenEnforcementMode: (mode: ChatState['tokenControl']['enforcementMode']) => {
        set(state => ({
          tokenControl: {
            ...state.tokenControl,
            enforcementMode: mode
          }
        }), false, { type: 'chat/setTokenEnforcementMode', mode });
      },
      
      addTokens: async (amount: number): Promise<boolean> => {
        try {
          const currentBalance = get().tokenControl.balance;
          
          set(state => ({
            tokenControl: {
              ...state.tokenControl,
              balance: currentBalance + amount,
              lastUpdated: new Date().toISOString()
            }
          }), false, { type: 'chat/addTokens', amount });
          
          return true;
        } catch (error) {
          console.error('Error adding tokens:', error);
          return false;
        }
      },
      
      spendTokens: async (amount: number): Promise<boolean> => {
        try {
          const currentBalance = get().tokenControl.balance;
          
          if (currentBalance < amount) {
            return false;
          }
          
          set(state => ({
            tokenControl: {
              ...state.tokenControl,
              balance: currentBalance - amount,
              queriesUsed: state.tokenControl.queriesUsed + 1,
              lastUpdated: new Date().toISOString()
            }
          }), false, { type: 'chat/spendTokens', amount });
          
          return true;
        } catch (error) {
          console.error('Error spending tokens:', error);
          return false;
        }
      },
      
      setTokenBalance: async (amount: number): Promise<boolean> => {
        try {
          set(state => ({
            tokenControl: {
              ...state.tokenControl,
              balance: amount,
              lastUpdated: new Date().toISOString()
            }
          }), false, { type: 'chat/setTokenBalance', amount });
          
          return true;
        } catch (error) {
          console.error('Error setting token balance:', error);
          return false;
        }
      },
      
      ...createInitializationActions(set, get),
      ...createFeatureActions(set, get),
      ...createUIActions(set, get),
    }),
    {
      name: 'ChatStore',
      enabled: process.env.NODE_ENV !== 'production',
    }
  )
);
