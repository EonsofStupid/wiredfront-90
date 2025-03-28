
import { ChatState } from '../../../types/chat-store-types';
import { SetState, GetState } from '../types';
import { logger } from '@/services/chat/LoggingService';
import { Provider } from '@/components/chat/types';

/**
 * Validates a provider object
 */
export const validateProvider = (provider: Provider): boolean => {
  if (!provider || typeof provider !== 'object') {
    return false;
  }
  
  // Check for required fields
  if (!provider.id || !provider.name) {
    return false;
  }
  
  return true;
};

/**
 * Creates provider actions for the chat store
 */
export const createProviderActions = (
  set: (state: Partial<ChatState> | ((state: ChatState) => Partial<ChatState>), replace?: boolean, action?: any) => void,
  get: () => ChatState
) => ({
  /**
   * Update the list of available providers
   */
  updateProviders: (providers: Provider[]) => {
    logger.info('Updating available providers', { count: providers.length });
    
    // Validate providers
    const validProviders = providers.filter(validateProvider);
    
    set({ 
      availableProviders: validProviders,
      providers: {
        ...get().providers,
        availableProviders: validProviders
      }
    }, false, { type: 'providers/updateAll' });
  },
  
  /**
   * Update the current chat provider
   */
  updateChatProvider: (provider: Provider) => {
    // Validate the provider first
    if (!validateProvider(provider)) {
      logger.error('Invalid provider', { provider });
      return;
    }
    
    logger.info('Updating chat provider', { providerId: provider.id });
    
    set({ currentProvider: provider }, false, { type: 'providers/setCurrent' });
  }
});
