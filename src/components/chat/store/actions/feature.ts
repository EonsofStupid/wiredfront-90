
import { StateCreator } from 'zustand';
import { ChatState } from '../types/chat-store-types';
import { logger } from '@/services/chat/LoggingService';

export const createFeatureActions = (
  set: StateCreator<ChatState>['setState'],
  get: () => ChatState
) => ({
  toggleFeature: (featureKey: keyof ChatState['features']) => {
    const features = get().features;
    const newValue = !features[featureKey];
    
    logger.info(`Toggling feature ${featureKey}`, { newValue });
    
    set({
      features: {
        ...features,
        [featureKey]: newValue
      }
    }, false, 'chat/toggleFeature');
  },
  
  setFeature: (featureKey: keyof ChatState['features'], value: boolean) => {
    logger.info(`Setting feature ${featureKey}`, { value });
    
    set({
      features: {
        ...get().features,
        [featureKey]: value
      }
    }, false, 'chat/setFeature');
  },
  
  setSelectedModel: (model: string) => {
    logger.info('Setting selected model', { model });
    
    set({
      selectedModel: model
    }, false, 'chat/setSelectedModel');
  },
  
  setSelectedMode: (mode: string) => {
    logger.info('Setting selected mode', { mode });
    
    set({
      selectedMode: mode
    }, false, 'chat/setSelectedMode');
  },
});
