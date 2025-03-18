
import { StateCreator } from 'zustand';
import { v4 as uuidv4 } from 'uuid';
import { ChatState, ProviderCategory } from '../types/chat-store-types';
import { logger } from '@/services/chat/LoggingService';

export const createInitializationActions = (
  set: (
    partial: ChatState | Partial<ChatState> | ((state: ChatState) => ChatState | Partial<ChatState>), 
    replace?: boolean, 
    action?: { type: string; [key: string]: any }
  ) => void,
  get: () => ChatState
) => ({
  initializeChatSettings: () => {
    const chatId = uuidv4();
    logger.info('Initializing chat settings', { chatId });
    
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
    logger.info('Setting available providers', { count: providers.length });
    
    set({
      availableProviders: providers
    }, false, { type: 'chat/setAvailableProviders', providers });
  },
  
  setCurrentProvider: (provider: ProviderCategory | null) => {
    logger.info('Setting current provider', { 
      provider: provider?.name,
      providerId: provider?.id
    });
    
    set({
      currentProvider: provider
    }, false, { type: 'chat/setCurrentProvider', provider });
  },
});
