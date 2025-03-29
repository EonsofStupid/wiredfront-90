
import { ChatState } from '../../../types/chat-store-types';
import { Provider } from '../../../../types/provider-types';
import { logger } from '@/services/chat/LoggingService';

// Define SetState and GetState types specifically for this file
type SetState<T> = (
  partial: T | Partial<T> | ((state: T) => T | Partial<T>),
  replace?: boolean
) => void;

type GetState<T> = () => T;

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
      logger.info('Updating chat provider', { provider: provider?.name });
      
      set({
        currentProvider: provider,
        providers: {
          ...get().providers,
          currentProvider: provider
        }
      });
    },
    
    /**
     * Update the list of available providers
     */
    updateAvailableProviders: (providers: Provider[]) => {
      logger.info('Updating available providers', { count: providers.length });
      
      set({
        availableProviders: providers,
        providers: {
          ...get().providers,
          availableProviders: providers
        }
      });
    }
  };
};
