
import { StateCreator } from 'zustand';
import { ChatState } from '../types/chat-store-types';
import { toast } from 'sonner';
import { logger } from '@/services/chat/LoggingService';

export const createInitializationActions = <T extends ChatState>(
  set: StateCreator<T>['setState'],
  get: () => T
) => ({
  initializeChatSettings: () => {
    try {
      const savedPosition = localStorage.getItem('chatPosition');
      const savedScale = localStorage.getItem('chatScale');
      const savedIsMinimized = localStorage.getItem('chatMinimized');
      const savedDocked = localStorage.getItem('chatDocked');
      
      if (savedPosition) {
        try {
          const position = JSON.parse(savedPosition);
          if (position && typeof position.x === 'number' && typeof position.y === 'number') {
            set({ position }, false, { type: 'chat/initializePosition' });
          }
        } catch (e) {
          // Invalid position data, use default
          logger.warn('Invalid saved chat position', e);
        }
      }
      
      if (savedScale) {
        const scale = parseFloat(savedScale);
        if (!isNaN(scale) && scale > 0) {
          set({ scale }, false, { type: 'chat/initializeScale' });
        }
      }
      
      if (savedIsMinimized) {
        set({ isMinimized: savedIsMinimized === 'true' }, false, { type: 'chat/initializeMinimized' });
      }
      
      if (savedDocked) {
        set({ docked: savedDocked === 'true' }, false, { type: 'chat/initializeDocked' });
      }
      
      set({ initialized: true }, false, { type: 'chat/initialized' });
      logger.info('Chat settings initialized successfully');
    } catch (error) {
      logger.error('Failed to initialize chat settings', { error });
      toast.error('Failed to initialize chat settings');
    }
  },
  
  saveSettings: () => {
    try {
      const state = get();
      localStorage.setItem('chatPosition', JSON.stringify(state.position));
      localStorage.setItem('chatScale', state.scale.toString());
      localStorage.setItem('chatMinimized', state.isMinimized.toString());
      localStorage.setItem('chatDocked', state.docked.toString());
      logger.info('Chat settings saved successfully');
    } catch (error) {
      logger.error('Failed to save chat settings', { error });
    }
  }
});
