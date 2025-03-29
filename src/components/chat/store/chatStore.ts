
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
  // Basic state
  initialized: false,
  isOpen: false,
  isMinimized: false,
  docked: true,
  showSidebar: false,
  scale: 1,
  
  // Input state
  messages: [],
  userInput: '',
  isWaitingForResponse: false,
  
  // Selection state
  selectedModel: 'gpt-4',
  selectedMode: 'chat',
  
  // UI status
  modelFetchStatus: 'idle',
  error: null,
  
  // Session state
  chatId: null,
  startTime: Date.now(),
  currentSession: null,
  sessions: {},
  
  // Position state
  position: ChatPosition.BottomRight,
  
  // Features
  features: {
    voice: true,
    rag: true,
    darkMode: true,
    imageGeneration: true,
    multiFile: true,
    ragSupport: true,
    githubSync: true,
    knowledgeBase: true,
    tokenEnforcement: false,
    standardChat: true,
    training: true,
    codeAssistant: true,
    notifications: true,
    modeSwitch: true
  },
  
  // Current mode
  currentMode: ChatMode.Chat,
  
  // Provider state
  availableProviders: [],
  currentProvider: null,
  
  providers: {
    currentProvider: null,
    availableProviders: []
  },
  
  // UI state
  ui: {
    sessionLoading: false,
    messageLoading: false,
    providerLoading: false,
  },
  
  // Custom styles
  customStyles: {},
  
  // Required actions - these will be implemented by action creators 
  resetChatState: () => {},
  setUserInput: () => {},
  toggleChat: () => {},
  toggleMinimize: () => {},
  toggleSidebar: () => {},
  toggleDocked: () => {},
  resetInput: () => {},
  setError: () => {},
  setCurrentSession: () => {},
  setChatId: () => {},
  setMode: () => {},
  setPosition: () => {},
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
        });
      },
      
      setUserInput: (input: string) => {
        set({ userInput: input });
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
