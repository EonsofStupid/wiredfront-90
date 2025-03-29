
import { ChatState } from '../../types/chat-store-types';
import { Provider } from '@/components/chat/types';
import { logger } from '@/services/chat/LoggingService';
import { SetState, GetState } from './types';

/**
 * Create provider-related actions for the chat store
 */
export const createProviderActions = (
  set: SetState<ChatState>,
  get: GetState<ChatState>
) => ({
  /**
   * Set available providers
   */
  setAvailableProviders: (providers: Provider[]) => {
    set({ 
      providers: {
        ...get().providers,
        availableProviders: providers
      },
      availableProviders: providers
    });
    logger.info('Available providers updated', { 
      count: providers.length,
      providers: providers.map(p => p.name)
    });
  },
  
  /**
   * Set the current provider
   */
  setCurrentProvider: (provider: Provider | null) => {
    set({ 
      currentProvider: provider,
      providers: {
        ...get().providers,
        currentProvider: provider
      }
    });
    logger.info('Current provider updated', { 
      provider: provider?.name || 'none'
    });
  },
  
  /**
   * Clear all provider data
   */
  clearProviders: () => {
    set({
      currentProvider: null,
      availableProviders: [],
      providers: {
        availableProviders: [],
        currentProvider: null
      }
    });
    logger.info('Provider data cleared');
  },
  
  /**
   * For compatibility with old API
   */
  updateProviders: (providers: Provider[]) => {
    set({ 
      providers: {
        ...get().providers,
        availableProviders: providers
      },
      availableProviders: providers
    });
    logger.info('Providers updated', { count: providers.length });
  },
  
  /**
   * For compatibility with old API
   */
  updateChatProvider: (provider: Provider | null) => {
    set({ 
      currentProvider: provider,
      providers: {
        ...get().providers,
        currentProvider: provider
      }
    });
    logger.info('Chat provider updated', { provider: provider?.name || 'none' });
  }
});

export type ProviderActions = ReturnType<typeof createProviderActions>;
