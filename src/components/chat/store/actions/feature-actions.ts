
import { ChatState } from '../types/chat-store-types';
import { createToggleActions } from './feature/toggle';
import { ChatMode } from '@/types/chat/enums';
import { logger } from '@/services/chat/LoggingService';
import { FeatureActions } from './feature/types';

/**
 * Creates feature-related actions for the chat store
 */
export const createFeatureActions = (
  set: (state: Partial<ChatState> | ((state: ChatState) => Partial<ChatState>), replace?: boolean, action?: any) => void,
  get: () => ChatState
): FeatureActions => {
  // Get toggle-specific actions
  const toggleActions = createToggleActions(set, get);
  
  return {
    // Feature toggle actions
    toggleFeature: toggleActions.toggleFeature,
    enableFeature: toggleActions.enableFeature,
    disableFeature: toggleActions.disableFeature,
    setFeatureState: toggleActions.setFeatureState,
    
    // Position actions
    togglePosition: toggleActions.togglePosition,
    setPosition: toggleActions.setPosition,
    
    // Provider actions
    updateProviders: toggleActions.updateProviders,
    updateChatProvider: toggleActions.updateChatProvider,
    
    // Mode actions
    toggleMode: () => {
      const currentMode = get().currentMode;
      const newMode = currentMode === ChatMode.Chat ? ChatMode.Dev : ChatMode.Chat;
      
      logger.info('Toggling chat mode', { from: currentMode, to: newMode });
      
      set({
        currentMode: newMode
      }, false, { type: 'chat/toggleMode' });
    },
    
    setMode: (mode: string | ChatMode) => {
      logger.info('Setting chat mode', { mode });
      
      // Ensure we're setting a valid chat mode
      const validMode = typeof mode === 'string' ? mode as ChatMode : mode;
      
      set({
        currentMode: validMode
      }, false, { type: 'chat/setMode' });
    },
    
    // Model actions
    setModel: (model: string) => {
      logger.info('Setting selected model', { model });
      
      set({
        selectedModel: model
      }, false, { type: 'chat/setModel' });
    },
    
    // Dock actions
    toggleDocked: () => {
      const isDocked = get().docked;
      logger.info('Toggling docked state', { from: isDocked, to: !isDocked });
      
      set({
        docked: !isDocked
      }, false, { type: 'chat/toggleDocked' });
    },
    
    setDocked: (docked: boolean) => {
      logger.info('Setting docked state', { docked });
      
      set({
        docked
      }, false, { type: 'chat/setDocked' });
    },
    
    // Token actions
    setTokenBalance: (balance: number) => {
      logger.info('Setting token balance', { balance });
      
      set({
        tokenBalance: balance
      }, false, { type: 'chat/setTokenBalance' });
    }
  };
};

// Export all feature actions
export * from './feature/toggle';
export * from './feature/types';
