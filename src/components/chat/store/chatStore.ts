import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import { v4 as uuidv4 } from 'uuid';
import { createInitializationActions } from './actions/initialization-actions';
import { createFeatureActions } from './actions/feature';
import { createUIActions } from './actions/ui-actions';
import { ChatState, ChatPosition } from './types/chat-store-types';
import { ChatProvider } from '@/components/chat/shared/types/chat-provider';
import { Message } from '@/components/chat/schemas/messages';

// Define the full store type with all action slices
type FullChatStore = ChatState & 
  ReturnType<typeof createInitializationActions> & 
  ReturnType<typeof createFeatureActions> & 
  ReturnType<typeof createUIActions>;

const initialState: ChatState = {
  // UI state
  isOpen: false,
  isMinimized: false,
  position: { position: 'bottom-right' },
  docked: true,
  scale: 1,
  showSidebar: false,
  
  // Chat state
  chatId: null,
  userInput: '',
  isWaitingForResponse: false,
  isInitialized: false,
  connectionState: 'disconnected',
  
  // UI state object
  ui: {
    sessionLoading: false,
    messageLoading: false,
    providerLoading: false,
    isChatLoaded: false,
    isChatInitialized: false
  },
  
  // Feature flags
  features: {
    voiceEnabled: true,
    imageGenEnabled: true,
    githubEnabled: true,
    codeCompletionEnabled: true,
    ragEnabled: true,
    tokenEnforcement: false
  },
  
  // Provider state
  availableProviders: [],
  currentProvider: null,
  providers: {
    availableProviders: []
  },
  
  // Token control
  tokenControl: {
    balance: 0,
    enforcementMode: 'never',
    lastUpdated: null,
    tokensPerQuery: 1,
    freeQueryLimit: 5,
    queriesUsed: 0
  },
  
  // Mode state
  mode: 'chat',
  messages: [],
  startTime: null,
  
  // Required actions
  setUserInput: () => {},
  toggleChat: () => {},
  toggleMinimize: () => {},
  toggleSidebar: () => {},
  setPosition: () => {},
  toggleDock: () => {},
  setScale: () => {},
  setChatId: () => {},
  toggleUIState: () => {},
  toggleFeature: () => {},
  setMode: () => {},
  setMessages: () => {},
  setStartTime: () => {},
  setAvailableProviders: () => {}
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
      key.includes('session-')
    );
    
    zustandKeys.forEach(key => {
      localStorage.removeItem(key);
      console.log(`Removed localStorage key: ${key}`);
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
      console.log(`Removed sessionStorage key: ${key}`);
    });
    
    console.log("🧹 Completed middleware storage cleanup");
  } catch (error) {
    console.error("Error clearing middleware storage:", error);
  }
};

export const useChatStore = create<FullChatStore>()(
  devtools(
    (set, get, api) => ({
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
      
      setMode: (mode: 'chat' | 'code' | 'image') => {
        set({ mode }, false, 'chat/setMode');
      },
      
      setMessages: (messages: Message[]) => {
        set({ messages }, false, 'chat/setMessages');
      },
      
      setStartTime: (time: number | null) => {
        set({ startTime: time }, false, 'chat/setStartTime');
      },
      
      setAvailableProviders: (providers: ChatProvider[]) => {
        set({ availableProviders: providers }, false, 'chat/setAvailableProviders');
      },
      
      ...createInitializationActions(set, get, api),
      ...createFeatureActions(set, get, api),
      ...createUIActions(set, get, api),
    }),
    {
      name: 'ChatStore',
      enabled: process.env.NODE_ENV !== 'production',
    }
  )
);
