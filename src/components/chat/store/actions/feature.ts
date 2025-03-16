
import { StateCreator } from 'zustand';
import { ChatState } from '../types/chat-store-types';

export const createFeatureActions = (
  set: StateCreator<ChatState>['setState'],
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
  
  toggleSidebar: () => {
    set((state) => ({ showSidebar: !state.showSidebar }), false, { type: 'chat/toggleSidebar' });
  },
  
  toggleMinimize: () => {
    set((state) => ({ isMinimized: !state.isMinimized }), false, { type: 'chat/toggleMinimize' });
  },
  
  setMinimized: (isMinimized: boolean) => {
    set({ isMinimized }, false, { type: 'chat/setMinimized', value: isMinimized });
  }
});
