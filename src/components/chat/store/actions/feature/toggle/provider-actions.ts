
import { ChatState, ChatProvider } from '../../../types/chat-store-types';
import { SetState, GetState } from '../types';

export function createProviderActions(
  set: SetState<ChatState>,
  get: GetState<ChatState>
) {
  return {
    updateChatProvider: (providers: ChatProvider[]) => {
      set(
        state => ({
          availableProviders: providers,
        }),
        false,
        { type: 'updateChatProvider', providers }
      );
    },

    updateCurrentProvider: (provider: ChatProvider) => {
      set(
        state => ({
          currentProvider: provider,
        }),
        false,
        { type: 'updateCurrentProvider', provider }
      );
    },

    updateAvailableProviders: (providers: ChatProvider[]) => {
      set(
        state => ({
          availableProviders: providers,
        }),
        false,
        { type: 'updateAvailableProviders', providers }
      );
    },
  };
}
