
import { ChatState } from '../../../types/chat-store-types';
import { SetState, GetState } from '../types';
import { logger } from '@/services/chat/LoggingService';
import { Provider } from '@/components/chat/types';
import { validateProvider } from './toggle-utils';

/**
 * Creates provider actions for the chat store
 */
export const createProviderActions = (
  set: SetState<ChatState>,
  get: GetState<ChatState>
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
