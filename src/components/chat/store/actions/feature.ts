
import { StateCreator } from 'zustand';
import { ChatState, FeatureState } from '../types/chat-store-types';
import { logger } from '@/services/chat/LoggingService';

export const createFeatureActions = <T extends ChatState>(
  set: StateCreator<T>['setState'],
  get: () => T
) => ({
  // Feature flag actions
  setFeatures: (features: Partial<FeatureState>) => {
    set(
      state => ({
        features: {
          ...state.features,
          ...features
        }
      }),
      false,
      { type: 'chat/setFeatures', features }
    );
    logger.info('Chat features updated', { features });
  },
  
  toggleFeature: (feature: keyof FeatureState) => {
    const currentState = get().features[feature];
    set(
      state => ({
        features: {
          ...state.features,
          [feature]: !currentState
        }
      }),
      false,
      { type: 'chat/toggleFeature', feature, value: !currentState }
    );
    logger.info(`Feature ${feature} toggled to ${!currentState}`);
  },
  
  enableFeature: (feature: keyof FeatureState) => {
    set(
      state => ({
        features: {
          ...state.features,
          [feature]: true
        }
      }),
      false,
      { type: 'chat/enableFeature', feature }
    );
    logger.info(`Feature ${feature} enabled`);
  },
  
  disableFeature: (feature: keyof FeatureState) => {
    set(
      state => ({
        features: {
          ...state.features,
          [feature]: false
        }
      }),
      false,
      { type: 'chat/disableFeature', feature }
    );
    logger.info(`Feature ${feature} disabled`);
  },
  
  setFeatureState: (feature: keyof FeatureState, isEnabled: boolean) => {
    set(
      state => ({
        features: {
          ...state.features,
          [feature]: isEnabled
        }
      }),
      false,
      { type: 'chat/setFeatureState', feature, isEnabled }
    );
    logger.info(`Feature ${feature} set to ${isEnabled}`);
  },
  
  resetFeatures: () => {
    set(
      () => ({
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
        }
      }),
      false,
      { type: 'chat/resetFeatures' }
    );
    logger.info('Chat features reset to defaults');
  }
});
