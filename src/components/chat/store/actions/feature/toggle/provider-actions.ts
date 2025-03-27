
import { ChatState, Provider } from '../../../types/chat-store-types';
import { SetState, GetState } from '../types';
import { logger } from '@/services/chat/LoggingService';

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
    
    set({
      availableProviders: providers,
      // If we have providers and no current provider is selected, 
      // select the first available one
      currentProvider: get().currentProvider || 
                     (providers.length > 0 ? providers[0] : null)
    }, false, { type: 'providers/update', count: providers.length });
  }
});
