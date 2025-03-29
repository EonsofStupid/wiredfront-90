
import { ChatState } from '../types/chat-store-types';
import { createToggleActions } from './feature/toggle';
import { ChatMode } from '@/types/chat/enums';
import { logger } from '@/services/chat/LoggingService';
import { FeatureActions, SetState, GetState } from './feature/types';

/**
 * Creates feature-related actions for the chat store
 */
export const createFeatureActions = (
  set: SetState<ChatState>,
  get: GetState<ChatState>
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
      });
    },
    
    setMode: (mode: string | ChatMode) => {
      logger.info('Setting chat mode', { mode });
      
      // Ensure we're setting a valid chat mode
      let validMode: ChatMode;
      if (typeof mode === 'string' && Object.values(ChatMode).includes(mode as ChatMode)) {
        validMode = mode as ChatMode;
      } else {
        validMode = ChatMode.Chat; // Default fallback
        logger.warn('Invalid chat mode provided, defaulting to Chat mode', { providedMode: mode });
      }
      
      set({
        currentMode: validMode
      });
    },
    
    // Model actions
    setModel: (model: string) => {
      logger.info('Setting selected model', { model });
      
      set((state) => ({
        selectedModel: model
      }));
    },
    
    // Dock actions
    toggleDocked: () => {
      const isDocked = get().docked;
      logger.info('Toggling docked state', { from: isDocked, to: !isDocked });
      
      set((state) => ({
        docked: !state.docked
      }));
    },
    
    setDocked: (docked: boolean) => {
      logger.info('Setting docked state', { docked });
      
      set({
        docked
      });
    },
    
    // Token actions
    setTokenBalance: (balance: number) => {
      logger.info('Setting token balance', { balance });
      
      set({
        tokenBalance: balance
      });
    }
  };
};

// Export all feature actions
export * from './feature/toggle';
export * from './feature/types';
