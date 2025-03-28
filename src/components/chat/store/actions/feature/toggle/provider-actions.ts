
import { ChatState } from '../../../types/chat-store-types';
import { SetState, GetState } from '../types';
import { logger } from '@/services/chat/LoggingService';
import { logProviderChange } from './toggle-utils';

/**
 * Provider interface for typed chat providers
 */
export interface Provider {
  id: string;
  name: string;
  maxTokens: number;
  description?: string;
  apiType?: string;
  models?: string[];
  isDefault?: boolean;
  icon?: string;
}

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
  updateProviders: (providers: Provider[]) => {
    logger.info('Updating available providers', { count: providers.length });
    
    set({
      availableProviders: providers
    }, false, { type: 'providers/updateAll', count: providers.length });
  },
  
  /**
   * Update the current chat provider
   */
  updateChatProvider: (provider: Provider) => {
    logger.info('Updating chat provider', { provider: provider.name });
    
    const oldProviderName = get().currentProvider?.name;
    logProviderChange(oldProviderName, provider.name);
    
    set({
      currentProvider: provider
    }, false, { type: 'providers/updateCurrent', provider: provider.id });
  }
});
