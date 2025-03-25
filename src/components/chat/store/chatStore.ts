
import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import { v4 as uuidv4 } from 'uuid';
import { createInitializationActions } from './actions/initialization-actions';
import { createFeatureActions } from './actions/feature';
import { createUIActions } from './actions/ui-actions';
import { ChatState } from './types/chat-store-types';

// Define the full store type with all action slices
type FullChatStore = ChatState & 
  ReturnType<typeof createInitializationActions> & 
  ReturnType<typeof createFeatureActions> & 
  ReturnType<typeof createUIActions>;

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
  position: 'bottom-right',
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
  },
  
  isMinimized: false,
  showSidebar: false,
  scale: 1,
  ui: {
    sessionLoading: false,
    messageLoading: false,
    providerLoading: false,
  },
  
  // Required actions
  resetChatState: () => {},
  setUserInput: () => {},
};

// Enhanced function to clear all Zustand middleware storage
export const clearMiddlewareStorage = () => {
  try {
    console.log("🧹 Starting complete middleware storage cleanup");
    
    // 1. Clear localStorage items
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
    
    // 2. Clear sessionStorage items
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
    
    // 3. Attempt to clear IndexedDB if available
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
        }, false, 'chat/resetState');
      },
      
      setUserInput: (input: string) => {
        set({ userInput: input }, false, 'chat/setUserInput');
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
