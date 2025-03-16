
import { ChatState, ChatProvider } from '../../../types/chat-store-types';
import { SetState, GetState } from '../types';
import { logProviderChange } from './toggle-utils';

// Create provider-specific actions
export const createProviderActions = (
  set: SetState<ChatState>,
  get: GetState<ChatState>
) => ({
  updateChatProvider: (providers: ChatProvider[]) =>
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
    
  updateCurrentProvider: (provider: ChatProvider) =>
    set(
      (state: ChatState) => {
        // If the provider is changing, log it
        if (state.currentProvider?.id !== provider.id) {
          logProviderChange(state.currentProvider?.name, provider.name);
        }
        
        return {
          ...state,
          currentProvider: provider
        };
      },
      false,
      { type: 'providers/setCurrent', provider: provider.id }
    ),
    
  updateAvailableProviders: (providers: ChatProvider[]) =>
    set(
      (state: ChatState) => {
        return {
          ...state,
          availableProviders: providers,
          providers: {
            ...state.providers,
            availableProviders: providers,
          }
        };
      },
      false,
      { type: 'providers/setAvailable' }
    )
});
