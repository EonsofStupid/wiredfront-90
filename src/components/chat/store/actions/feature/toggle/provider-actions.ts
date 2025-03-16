
import { ChatState, ChatProvider } from '../../../types/chat-store-types';
import { SetState, GetState } from '../types';

export function createProviderActions(
  set: SetState<ChatState>,
  get: GetState<ChatState>
) {
  return {
    updateChatProvider: (providers: ChatProvider[]) => {
      set(
        {
          availableProviders: providers
        }, 
        false, 
        'providers/update'
      );
    },
    
    updateCurrentProvider: (provider: ChatProvider) => {
      set(
        {
          currentProvider: provider
        },
        false,
        'providers/setCurrent'
      );
    },
    
    updateAvailableProviders: (providers: ChatProvider[]) => {
      set(
        state => ({
          providers: {
            ...state.providers,
            availableProviders: providers
          }
        }),
        false,
        'providers/setAvailable'
      );
    }
  };
}
