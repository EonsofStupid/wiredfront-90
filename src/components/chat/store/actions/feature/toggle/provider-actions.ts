
import { ChatState } from '../../../types/chat-store-types';
import { Provider } from '@/components/chat/types/provider-types';
import { SetState, GetState } from '../types';
import { logger } from '@/services/chat/LoggingService';

/**
 * Creates provider-related actions for the chat store
 */
export const createProviderActions = (
  set: SetState<ChatState>,
  get: GetState<ChatState>
) => {
  return {
    /**
     * Update the current chat provider
     */
    updateChatProvider: (provider: Provider | null) => {
      logger.info(`Updating current provider to: ${provider?.name || 'null'}`);
      
      set(state => ({
        currentProvider: provider,
        providers: {
          ...state.providers,
          currentProvider: provider
        }
      }));
    },
    
    /**
     * Update the list of available providers
     */
    updateAvailableProviders: (providers: Provider[]) => {
      logger.info(`Updating available providers (count: ${providers.length})`);
      
      set(state => ({
        availableProviders: providers,
        providers: {
          ...state.providers,
          availableProviders: providers
        }
      }));
    }
  };
};
