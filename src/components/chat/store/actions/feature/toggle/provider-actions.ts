
import { ChatState, Provider } from '../../../types/chat-store-types';
import { SetState, GetState } from '../types';
import { logger } from '@/services/chat/LoggingService';
import { logProviderChange } from './toggle-utils';

/**
 * Creates provider-related actions for the chat store
 */
export const createProviderActions = (
  set: SetState<ChatState>,
  get: GetState<ChatState>
) => ({
  /**
   * Update available chat providers
   */
  updateChatProvider: (providers: Provider[]) => {
    logger.info('Updating chat providers', { count: providers.length });
    
    const currentProviderId = get().currentProvider?.id;
    const newCurrentProvider = providers.length > 0 ? 
      (currentProviderId ? 
        providers.find(p => p.id === currentProviderId) || providers[0] 
        : providers[0])
      : null;

    // Log provider change if it changed
    if (newCurrentProvider?.id !== currentProviderId) {
      const oldProviderName = get().currentProvider?.name;
      const newProviderName = newCurrentProvider?.name;
      logProviderChange(oldProviderName, newProviderName);
    }
    
    set({
      availableProviders: providers,
      currentProvider: newCurrentProvider
    }, false, { type: 'providers/update', count: providers.length });
  },
  
  /**
   * Set the current provider
   */
  setCurrentProvider: (providerId: string) => {
    const providers = get().availableProviders;
    const provider = providers.find(p => p.id === providerId);
    
    if (!provider) {
      logger.warn('Attempted to set unknown provider', { providerId });
      return;
    }
    
    const oldProviderName = get().currentProvider?.name;
    logProviderChange(oldProviderName, provider.name);
    
    logger.info('Setting current provider', { providerId, name: provider.name });
    
    set({
      currentProvider: provider
    }, false, { type: 'providers/setCurrent', providerId });
  }
});
