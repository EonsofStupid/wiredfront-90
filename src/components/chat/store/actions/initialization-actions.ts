
import { ChatState } from '../types/chat-store-types';

// Define initialization actions
export const createInitializationActions = (
  set: (
    partial: ChatState | Partial<ChatState> | ((state: ChatState) => ChatState | Partial<ChatState>), 
    replace?: boolean, 
    action?: { type: string; [key: string]: any }
  ) => void,
  get: () => ChatState
) => {
  return {
    initialize: () => {
      if (get().initialized) return;
      
      // Load saved position from localStorage
      try {
        const savedPosition = localStorage.getItem('chat-position');
        if (savedPosition === 'bottom-left' || savedPosition === 'bottom-right') {
          set({ position: savedPosition }, false, { type: 'chat/loadSavedPosition', position: savedPosition });
        }
      } catch (e) {
        console.error('Failed to load chat position from localStorage', e);
      }
      
      // Continue with other initializations...
      set({ initialized: true }, false, { type: 'chat/initialize' });
    },
    
    initializeSettings: () => {
      const { initialized } = get();
      if (initialized) return;
      
      // Initialize chat settings logic
      set({ initialized: true }, false, { type: 'chat/initializeSettings' });
    }
  };
};
