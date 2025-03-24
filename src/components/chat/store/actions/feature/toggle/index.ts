
import { ChatState } from '../../../types/chat-store-types';
import { SetState, GetState, FeatureKey } from '../types';
import { createProviderActions } from './provider-actions';

export const createToggleActions = (
  set: SetState<ChatState>,
  get: GetState<ChatState>
) => ({
  toggleFeature: (feature: FeatureKey) => {
    set(
      (state: ChatState) => ({
        ...state,
        features: {
          ...state.features,
          [feature]: !state.features[feature],
        },
      }),
      false,
      { type: 'features/toggle', feature }
    );
  },

  enableFeature: (feature: FeatureKey) => {
    set(
      (state: ChatState) => ({
        ...state,
        features: {
          ...state.features,
          [feature]: true,
        },
      }),
      false,
      { type: 'features/enable', feature }
    );
  },

  disableFeature: (feature: FeatureKey) => {
    set(
      (state: ChatState) => ({
        ...state,
        features: {
          ...state.features,
          [feature]: false,
        },
      }),
      false,
      { type: 'features/disable', feature }
    );
  },

  setFeatureState: (feature: FeatureKey, isEnabled: boolean) => {
    set(
      (state: ChatState) => ({
        ...state,
        features: {
          ...state.features,
          [feature]: isEnabled,
        },
      }),
      false,
      { type: 'features/setState', feature, isEnabled }
    );
  },

  ...createProviderActions(set, get),
});
