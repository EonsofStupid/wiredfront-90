
import { logger } from '@/services/chat/LoggingService';
import { ChatState } from '../types/chat-store-types';

export const createFeatureActions = (set: Function, get: Function) => ({
  toggleFeature: (feature: keyof ChatState['features']) => set((state: ChatState) => {
    const newValue = !state.features[feature];
    logger.info('Chat feature toggled', { 
      feature, 
      wasEnabled: state.features[feature],
      isNowEnabled: newValue
    });
    return {
      features: {
        ...state.features,
        [feature]: newValue
      }
    };
  }),
  
  setCurrentProvider: (providerId: string) => set((state: ChatState) => {
    const provider = state.providers.availableProviders.find(p => p.id === providerId);
    if (provider && provider.isEnabled) {
      logger.info('Chat provider changed', { 
        fromProvider: state.providers.currentProvider,
        toProvider: provider.type
      });
      return {
        providers: {
          ...state.providers,
          currentProvider: provider.type
        }
      };
    }
    return state;
  }),
  
  toggleProviderEnabled: (providerId: string) => set((state: ChatState) => {
    const provider = state.providers.availableProviders.find(p => p.id === providerId);
    if (!provider) return state;
    
    const newState = !provider.isEnabled;
    logger.info('Chat provider availability toggled', { 
      provider: provider.type,
      wasEnabled: provider.isEnabled,
      isNowEnabled: newState
    });
    
    return {
      providers: {
        ...state.providers,
        availableProviders: state.providers.availableProviders.map(p =>
          p.id === providerId 
            ? { ...p, isEnabled: newState }
            : p
        )
      }
    };
  })
});
