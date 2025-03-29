
import { ChatState } from '../types/chat-store-types';
import { ChatPosition } from '@/types/chat/enums';
import { SetState, GetState } from './feature/types';

/**
 * Create UI-related actions for the chat store
 */
export const createUIActions = (
  set: SetState<ChatState>,
  get: GetState<ChatState>
) => ({
  /**
   * Toggle the chat open/closed state
   */
  toggleChat: () => {
    const isOpen = get().isOpen;
    set({ isOpen: !isOpen }, false, { type: 'ui/toggleChat' });
  },
  
  /**
   * Toggle the minimized state
   */
  toggleMinimize: () => {
    const isMinimized = get().isMinimized;
    set({ isMinimized: !isMinimized }, false, { type: 'ui/toggleMinimize' });
  },
  
  /**
   * Toggle the sidebar visibility
   */
  toggleSidebar: () => {
    const showSidebar = get().showSidebar;
    set({ showSidebar: !showSidebar }, false, { type: 'ui/toggleSidebar' });
  },
  
  /**
   * Set the current chat ID
   */
  setChatId: (chatId: string | null) => {
    set({ chatId }, false, { type: 'ui/setChatId', chatId });
  },
  
  /**
   * Update the chat window size
   */
  setChatWindowSize: (width: number, height: number) => {
    set({ 
      windowSize: { width, height } 
    }, false, { 
      type: 'ui/setWindowSize', 
      width, 
      height 
    });
  },
  
  /**
   * Update the chat window position
   */
  setChatWindowPosition: (x: number, y: number) => {
    set({ 
      windowPosition: { x, y } 
    }, false, { 
      type: 'ui/setWindowPosition', 
      x, 
      y 
    });
  },
  
  /**
   * Set session loading state
   */
  setSessionLoading: (isLoading: boolean) => {
    set({
      ui: {
        ...get().ui,
        sessionLoading: isLoading
      }
    }, false, { 
      type: 'ui/setSessionLoading'
    });
  },
  
  /**
   * Set message loading state
   */
  setMessageLoading: (isLoading: boolean) => {
    set({
      ui: {
        ...get().ui,
        messageLoading: isLoading
      }
    }, false, { 
      type: 'ui/setMessageLoading'
    });
  },
  
  /**
   * Set provider loading state
   */
  setProviderLoading: (isLoading: boolean) => {
    set({
      ui: {
        ...get().ui,
        providerLoading: isLoading
      }
    }, false, { 
      type: 'ui/setProviderLoading'
    });
  }
});

export type UIActions = ReturnType<typeof createUIActions>;
