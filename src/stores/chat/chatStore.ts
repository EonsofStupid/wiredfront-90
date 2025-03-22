import { TokenEnforcementMode } from '@/integrations/supabase/types/enums';
import { Message } from '@/types/chat';
import { ChatMode, ChatState, FeatureState, ProviderCategory } from '@/types/store/chat/types';
import { v4 as uuidv4 } from 'uuid';
import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';

type FullChatStore = ChatState & {
  // Actions
  resetChatState: () => void;
  setUserInput: (input: string) => void;
  addMessage: (message: Message) => void;
  updateMessage: (id: string, updates: Partial<Message>) => void;
  toggleDocked: () => void;
  setScale: (scale: number) => void;
  setCurrentMode: (mode: ChatMode) => void;
  updateCurrentProvider: (provider: ProviderCategory) => void;
  updateAvailableProviders: (providers: ProviderCategory[]) => void;
  updateChatProvider: (providers: ProviderCategory[]) => void;
  toggleFeature: (featureName: keyof FeatureState) => void;
  enableFeature: (featureName: keyof FeatureState) => void;
  disableFeature: (featureName: keyof FeatureState) => void;
  setFeatureState: (featureName: keyof FeatureState, isEnabled: boolean) => void;
  setTokenEnforcementMode: (mode: TokenEnforcementMode) => void;
  addTokens: (amount: number) => Promise<boolean>;
  spendTokens: (amount: number) => Promise<boolean>;
  setTokenBalance: (balance: number) => Promise<boolean>;
  // Layout actions
  toggleMinimize: () => void;
  toggleOpen: () => void;
  setPosition: (position: { x: number; y: number }) => void;
  togglePosition: () => void;
  toggleSidebar: () => void;
  setTheme: (theme: string) => void;
  updatePreferences: (prefs: any) => void;
  resetLayout: () => void;
};

const initialState: ChatState = {
  initialized: false,
  messages: [],
  userInput: '',
  isWaitingForResponse: false,
  selectedModel: 'gpt-4',
  selectedMode: 'chat' as ChatMode,
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
  currentMode: 'chat' as ChatMode,
  availableProviders: [],
  currentProvider: null,
  position: { x: 0, y: 0 },
  tokenControl: {
    balance: 0,
    enforcementMode: 'never' as TokenEnforcementMode,
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
  theme: 'light',
  uiPreferences: {
    messageBehavior: 'enter_send',
    notifications: true,
    soundEnabled: true,
    typingIndicators: true
  }
};

export const useChatStore = create<FullChatStore>()(
  devtools(
    persist(
      (set, get) => ({
        ...initialState,

        resetChatState: () => {
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
              ...message,
              id: message.id || uuidv4(),
              timestamp: message.timestamp || new Date().toISOString(),
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

        setTokenEnforcementMode: (mode: TokenEnforcementMode) => {
          set(state => ({
            tokenControl: {
              ...state.tokenControl,
              enforcementMode: mode,
            },
          }), false, { type: 'chat/setTokenEnforcementMode', mode });
        },

        addTokens: async (amount: number) => {
          set(state => ({
            tokenControl: {
              ...state.tokenControl,
              balance: state.tokenControl.balance + amount,
              lastUpdated: new Date().toISOString(),
            },
          }), false, { type: 'chat/addTokens', amount });
          return true;
        },

        spendTokens: async (amount: number) => {
          const state = get();
          if (state.tokenControl.balance < amount) {
            return false;
          }
          set(state => ({
            tokenControl: {
              ...state.tokenControl,
              balance: state.tokenControl.balance - amount,
              lastUpdated: new Date().toISOString(),
            },
          }), false, { type: 'chat/spendTokens', amount });
          return true;
        },

        setTokenBalance: async (balance: number) => {
          set(state => ({
            tokenControl: {
              ...state.tokenControl,
              balance,
              lastUpdated: new Date().toISOString(),
            },
          }), false, { type: 'chat/setTokenBalance', balance });
          return true;
        },

        // Layout actions
        toggleMinimize: () => {
          set(state => ({ isMinimized: !state.isMinimized }), false, { type: 'chat/toggleMinimize' });
        },

        toggleOpen: () => {
          set(state => ({ isOpen: !state.isOpen }), false, { type: 'chat/toggleOpen' });
        },

        setPosition: (position) => {
          set({ position }, false, { type: 'chat/setPosition' });
        },

        togglePosition: () => {
          set(state => ({
            position: {
              x: state.position.x > window.innerWidth / 2 ? 0 : window.innerWidth,
              y: state.position.y
            }
          }), false, { type: 'chat/togglePosition' });
        },

        toggleSidebar: () => {
          set(state => ({ showSidebar: !state.showSidebar }), false, { type: 'chat/toggleSidebar' });
        },

        setTheme: (theme) => {
          set({ theme }, false, { type: 'chat/setTheme' });
        },

        updatePreferences: (prefs) => {
          set(state => ({
            uiPreferences: { ...state.uiPreferences, ...prefs }
          }), false, { type: 'chat/updatePreferences' });
        },

        resetLayout: () => {
          set({
            isMinimized: initialState.isMinimized,
            docked: initialState.docked,
            position: initialState.position,
            scale: initialState.scale,
            showSidebar: initialState.showSidebar,
            theme: initialState.theme,
            uiPreferences: initialState.uiPreferences
          }, false, { type: 'chat/resetLayout' });
        }
      }),
      {
        name: 'chat-storage',
        partialize: (state) => ({
          messages: state.messages,
          features: state.features,
          uiPreferences: state.uiPreferences,
          theme: state.theme,
          position: state.position,
          scale: state.scale,
          isMinimized: state.isMinimized,
          docked: state.docked,
          showSidebar: state.showSidebar
        })
      }
    )
  )
);
