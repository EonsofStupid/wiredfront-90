
import { ChatState } from '../../../types/chat-store-types';
import { FeatureKey, SetState, GetState } from '../types';

export function createFeatureToggleActions(
  set: SetState<ChatState>,
  get: GetState<ChatState>
) {
  return {
    toggleFeature: (feature: FeatureKey) => {
      if (!(feature in get().features)) {
        console.warn(`Feature '${feature}' does not exist in the store`);
        return;
      }
      
      set(
        state => ({
          features: {
            ...state.features,
            [feature]: !state.features[feature as keyof typeof state.features]
          }
        }),
        false,
        { type: 'toggleFeature', feature, value: !get().features[feature as keyof typeof get().features] }
      );
    },
    
    enableFeature: (feature: FeatureKey) => {
      if (!(feature in get().features)) {
        console.warn(`Feature '${feature}' does not exist in the store`);
        return;
      }
      
      set(
        state => ({
          features: {
            ...state.features,
            [feature]: true
          }
        }),
        false,
        { type: 'enableFeature', feature }
      );
    },
    
    disableFeature: (feature: FeatureKey) => {
      if (!(feature in get().features)) {
        console.warn(`Feature '${feature}' does not exist in the store`);
        return;
      }
      
      set(
        state => ({
          features: {
            ...state.features,
            [feature]: false
          }
        }),
        false,
        { type: 'disableFeature', feature }
      );
    },
    
    setFeatureState: (feature: FeatureKey, isEnabled: boolean) => {
      if (!(feature in get().features)) {
        console.warn(`Feature '${feature}' does not exist in the store`);
        return;
      }
      
      set(
        state => ({
          features: {
            ...state.features,
            [feature]: isEnabled
          }
        }),
        false,
        { type: 'setFeatureState', feature, isEnabled }
      );
    }
  };
}
