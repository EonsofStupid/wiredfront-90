
import { ChatState } from '../../../types/chat-store-types';
import { SetState, GetState } from '../types';
import { logProviderChange } from './toggle-utils';

// Create provider-specific actions
export const createProviderActions = (
  set: SetState<ChatState>,
  get: GetState<ChatState>
) => ({
  updateChatProvider: (providers: ChatState['availableProviders']) =>
    set(
      (state: ChatState) => {
        const newDefaultProvider = providers.find((p) => p.isDefault) || providers[0] || state.currentProvider;
        
        // If the provider is changing, log it
        if (state.currentProvider?.id !== newDefaultProvider?.id) {
          logProviderChange(state.currentProvider?.name, newDefaultProvider?.name);
        }
        
        return {
          ...state,
          availableProviders: providers,
          currentProvider: newDefaultProvider,
          providers: {
            ...state.providers,
            availableProviders: providers,
          },
        };
      },
      false,
      { type: 'providers/update', count: providers.length }
    ),
});
