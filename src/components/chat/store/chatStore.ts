
import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import { createInitializationActions } from './actions/initialization-actions';
import { createFeatureActions } from './actions/feature-actions';
import { createUIActions } from './actions/ui-actions';
import { ChatState } from './types/chat-store-types';
import { logger } from '@/services/chat/LoggingService';
import { ChatMode, ChatPosition } from '@/types/chat/enums';

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
  isMinimized: false,
  position: ChatPosition.BottomRight,
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
    knowledgeBase: true,
    tokenEnforcement: false,
  },
  currentMode: ChatMode.Chat,
  availableProviders: [],
  currentProvider: null,
  
  providers: {
    availableProviders: [],
  },
  
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
  toggleChat: () => {},
  toggleMinimize: () => {},
  toggleSidebar: () => {},
  toggleDocked: () => {},
  setPosition: () => {},
  setChatId: () => {},
  setMode: () => {},
  initializeChat: () => {},
  setSessionLoading: () => {},
  setMessageLoading: () => {},
  setProviderLoading: () => {},
};

// Enhanced function to clear all Zustand middleware storage
export const clearMiddlewareStorage = () => {
  try {
    logger.info("🧹 Starting complete middleware storage cleanup");
    
    // 1. Clear localStorage items
    const allKeys = Object.keys(localStorage);
    const zustandKeys = allKeys.filter(key => 
      key.includes('zustand') || 
      key.includes('chat-') || 
      key.includes('provider-') || 
      key.includes('session-') ||
      key.startsWith('persist:')
    );
    
    logger.info(`Found ${zustandKeys.length} Zustand-related localStorage keys to remove`);
    zustandKeys.forEach(key => {
      localStorage.removeItem(key);
      logger.debug(`Removed storage key: ${key}`);
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
      logger.debug(`Removed session storage key: ${key}`);
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
          request.onsuccess = () => logger.debug(`Deleted IndexedDB: ${dbName}`);
          request.onerror = () => logger.error(`Failed to delete IndexedDB: ${dbName}`);
        });
      } catch (idbError) {
        logger.error('Error clearing IndexedDB:', idbError);
      }
    }
    
    logger.info('Middleware storage cleanup completed');
    return true;
  } catch (e) {
    logger.error('Error clearing middleware storage:', e);
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
        set({ userInput: input }, false, { type: 'chat/setUserInput', input });
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
