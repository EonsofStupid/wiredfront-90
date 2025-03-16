
import { StateCreator } from 'zustand';
import { ChatState } from '../types/chat-store-types';

export const createFeatureActions = (
  set: (
    partial: ChatState | Partial<ChatState> | ((state: ChatState) => ChatState | Partial<ChatState>), 
    replace?: boolean, 
    action?: { type: string; [key: string]: any }
  ) => void,
  get: () => ChatState
) => ({
  toggleFeature: (featureName: keyof ChatState['features']) => {
    set((state) => ({
      features: {
        ...state.features,
        [featureName]: !state.features[featureName],
      },
    }), false, { type: 'chat/toggleFeature', feature: featureName });
  },
  
  enableFeature: (featureName: keyof ChatState['features']) => {
    set((state) => ({
      features: {
        ...state.features,
        [featureName]: true,
      },
    }), false, { type: 'chat/enableFeature', feature: featureName });
  },
  
  disableFeature: (featureName: keyof ChatState['features']) => {
    set((state) => ({
      features: {
        ...state.features,
        [featureName]: false,
      },
    }), false, { type: 'chat/disableFeature', feature: featureName });
  },
  
  setMode: (mode: ChatState['currentMode']) => {
    set({ currentMode: mode }, false, { type: 'chat/setMode', mode });
  },
  
  setCurrentMode: (mode: ChatState['currentMode']) => {
    set({ currentMode: mode }, false, { type: 'chat/setCurrentMode', mode });
  },
  
  updateCurrentProvider: (provider: ChatState['currentProvider']) => {
    set({ currentProvider: provider }, false, { type: 'chat/updateCurrentProvider', provider });
  },
  
  updateAvailableProviders: (providers: ChatState['availableProviders']) => {
    set({ availableProviders: providers }, false, { type: 'chat/updateAvailableProviders', providers });
  },
  
  updateChatProvider: (providers: ChatState['availableProviders']) => {
    set({ availableProviders: providers }, false, { type: 'chat/updateChatProvider', providers });
  },
  
  setFeatureState: (featureName: keyof ChatState['features'], isEnabled: boolean) => {
    set((state) => ({
      features: {
        ...state.features,
        [featureName]: isEnabled,
      },
    }), false, { type: 'chat/setFeatureState', feature: featureName, isEnabled });
  },
  
  toggleSidebar: () => {
    set((state) => ({ showSidebar: !state.showSidebar }), false, { type: 'chat/toggleSidebar' });
  },
  
  toggleMinimize: () => {
    set((state) => ({ isMinimized: !state.isMinimized }), false, { type: 'chat/toggleMinimize' });
  },
  
  setMinimized: (isMinimized: boolean) => {
    set({ isMinimized }, false, { type: 'chat/setMinimized', value: isMinimized });
  },
  
  // Token related actions
  setTokenEnforcementMode: (mode: ChatState['tokenControl']['enforcementMode']) => {
    set((state) => ({
      tokenControl: {
        ...state.tokenControl,
        enforcementMode: mode
      }
    }), false, { type: 'chat/setTokenEnforcementMode', mode });
  },
  
  addTokens: async (amount: number): Promise<boolean> => {
    try {
      const currentBalance = get().tokenControl.balance;
      
      set((state) => ({
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
      
      set((state) => ({
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
      set((state) => ({
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
  }
});
