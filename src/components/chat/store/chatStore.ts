
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
    // Add new feature flags matching what UI components expect
    codeAssistant: true,
    ragSupport: true,
    githubSync: true,
    tokenEnforcement: false, // Default to disabled
  },
  currentMode: 'chat',
  availableProviders: [],
  currentProvider: null,
  
  // Token control system
  tokenControl: {
    balance: 0,
    enforcementMode: 'never',
    lastUpdated: null,
    tokensPerQuery: 1,
    freeQueryLimit: 5,
    queriesUsed: 0
  },
  
  // Add providers mapping for session management
  providers: {
    availableProviders: [],
  },
  
  // UI state properties
  isMinimized: false,
  showSidebar: false,
  scale: 1,
  ui: {
    sessionLoading: false,
    messageLoading: false,
    providerLoading: false,
  },
};

// Enhanced function to clear all Zustand middleware storage
export const clearMiddlewareStorage = () => {
  try {
    // Clear specific chat-state items
    localStorage.removeItem('chat-state');
    localStorage.removeItem('ChatStore');
    
    // Clear all Zustand storage items
    const zustandKeys = Object.keys(localStorage).filter(key => 
      key.startsWith('chat-') || 
      key.includes('zustand') || 
      key.includes('session-') ||
      key.includes('provider-')
    );
    
    zustandKeys.forEach(key => {
      localStorage.removeItem(key);
      console.log(`Removed storage key: ${key}`);
    });
    
    // Clear IndexedDB if available
    if (window.indexedDB) {
      try {
        const chatDBs = ['zustand-chat', 'chat-sessions', 'chat-providers'];
        chatDBs.forEach(dbName => {
          window.indexedDB.deleteDatabase(dbName);
          console.log(`Deleted IndexedDB: ${dbName}`);
        });
      } catch (idbError) {
        console.error('Error clearing IndexedDB:', idbError);
      }
    }
    
    console.log('All middleware storage cleared successfully');
  } catch (e) {
    console.error('Error clearing middleware storage:', e);
  }
};

export const useChatStore = create<FullChatStore>()(
  devtools(
    (set, get) => ({
      ...initialState,
      
      // Add a method to reset the chat state
      resetChatState: () => {
        // First clear middleware storage
        clearMiddlewareStorage();
        
        // Then reset the state
        set({
          ...initialState,
          initialized: true, // Keep initialized true
          availableProviders: get().availableProviders, // Keep available providers
          currentProvider: get().currentProvider, // Keep current provider
          // Preserve feature settings
          features: get().features,
        }, false, 'chat/resetState');
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
