
import { StateCreator } from 'zustand';
import { v4 as uuidv4 } from 'uuid';
import { ChatState, ProviderCategory } from '../types/chat-store-types';

export const createInitializationActions = (
  set: StateCreator<ChatState>['setState'],
  get: () => ChatState
) => ({
  initializeChatSettings: () => {
    const chatId = uuidv4();
    set({
      initialized: true,
      chatId,
      messages: [],
      isOpen: false,
      userInput: '',
      isWaitingForResponse: false,
      startTime: Date.now(),
    }, false, { type: 'chat/initializeChatSettings' });
  },
  
  setAvailableProviders: (providers: ProviderCategory[]) => {
    set({
      availableProviders: providers
    }, false, { type: 'chat/setAvailableProviders', providers });
  },
  
  setCurrentProvider: (provider: ProviderCategory | null) => {
    set({
      currentProvider: provider
    }, false, { type: 'chat/setCurrentProvider', provider });
  },
});
