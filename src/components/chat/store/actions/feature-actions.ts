
import { StateCreator } from 'zustand';
import { ChatState, ChatProvider } from "../types/chat-store-types";

export type FeatureKey = 'voice' | 'rag' | 'modeSwitch' | 'notifications' | 'github' | 
                         'codeAssistant' | 'ragSupport' | 'githubSync';

export type FeatureActions = {
  toggleFeature: (feature: FeatureKey) => void;
  enableFeature: (feature: FeatureKey) => void;
  disableFeature: (feature: FeatureKey) => void;
  setFeatureState: (feature: FeatureKey, isEnabled: boolean) => void;
  updateChatProvider: (providers: ChatProvider[]) => void;
};

export const createFeatureActions: StateCreator<
  ChatState,
  [],
  [],
  FeatureActions
> = (set, get, api) => ({
  toggleFeature: (feature) =>
    set(
      (state) => ({
        features: {
          ...state.features,
          [feature]: !state.features[feature],
        },
      }),
      false,
      { type: 'features/toggle', feature }
    ),

  enableFeature: (feature) =>
    set(
      (state) => ({
        features: {
          ...state.features,
          [feature]: true,
        },
      }),
      false,
      { type: 'features/enable', feature }
    ),

  disableFeature: (feature) =>
    set(
      (state) => ({
        features: {
          ...state.features,
          [feature]: false,
        },
      }),
      false,
      { type: 'features/disable', feature }
    ),

  setFeatureState: (feature, isEnabled) =>
    set(
      (state) => ({
        features: {
          ...state.features,
          [feature]: isEnabled,
        },
      }),
      false,
      { type: 'features/setState', feature, isEnabled }
    ),
    
  // Update available chat providers
  updateChatProvider: (providers) =>
    set(
      (state) => ({
        availableProviders: providers,
        currentProvider: providers.find((p: ChatProvider) => p.isDefault) || providers[0] || state.currentProvider,
      }),
      false,
      { type: 'providers/update', providers }
    ),
});
