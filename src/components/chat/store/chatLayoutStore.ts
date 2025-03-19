
import { create } from 'zustand';
import { ChatPosition, ChatLayoutState, DockPosition, ChatUIPreferences } from '@/types/chat/ui';
import { logger } from '@/services/chat/LoggingService';
import { supabase } from '@/integrations/supabase/client';

// Default UI preferences
const defaultUIPreferences: ChatUIPreferences = {
  theme: 'dark',
  fontSize: 'medium',
  messageBehavior: 'enter_send',
  notifications: true,
  showTimestamps: true
};

// Initial layout state
const initialState: ChatLayoutState = {
  isMinimized: false,
  docked: true,
  position: { x: 0, y: 0 },
  scale: 1,
  showSidebar: false,
  dockedItems: {},
  uiPreferences: defaultUIPreferences
};

interface ChatLayoutStore extends ChatLayoutState {
  // Action methods
  setMinimized: (isMinimized: boolean) => void;
  toggleMinimized: () => void;
  setDocked: (docked: boolean) => void;
  toggleDocked: () => void;
  setPosition: (position: ChatPosition) => void;
  setScale: (scale: number) => void;
  toggleSidebar: () => void;
  setSidebar: (visible: boolean) => void;
  setDockedItem: (id: string, position: DockPosition) => void;
  updateUIPreferences: (preferences: Partial<ChatUIPreferences>) => void;
  resetLayout: () => void;
  
  // Persistence methods
  saveLayoutToStorage: () => Promise<boolean>;
  loadLayoutFromStorage: () => Promise<boolean>;
}

/**
 * Store for managing chat UI layout and docking
 */
export const useChatLayoutStore = create<ChatLayoutStore>((set, get) => ({
  ...initialState,

  // UI state setters
  setMinimized: (isMinimized) => set({ isMinimized }),
  
  toggleMinimized: () => set(state => ({ isMinimized: !state.isMinimized })),
  
  setDocked: (docked) => set({ docked }),
  
  toggleDocked: () => set(state => ({ docked: !state.docked })),
  
  setPosition: (position) => set({ position }),
  
  setScale: (scale) => set({ scale }),
  
  toggleSidebar: () => set(state => ({ showSidebar: !state.showSidebar })),
  
  setSidebar: (visible) => set({ showSidebar: visible }),
  
  setDockedItem: (id, position) => set(state => ({
    dockedItems: {
      ...state.dockedItems,
      [id]: position
    }
  })),
  
  updateUIPreferences: (preferences) => set(state => ({
    uiPreferences: {
      ...state.uiPreferences,
      ...preferences
    }
  })),
  
  resetLayout: () => set({ ...initialState }),
  
  // Persistence methods
  saveLayoutToStorage: async () => {
    try {
      const userId = (await supabase.auth.getUser()).data.user?.id;
      if (!userId) return false;
      
      const layout = {
        is_minimized: get().isMinimized,
        docked: get().docked,
        position: get().position,
        scale: get().scale,
        docked_items: get().dockedItems || {},
        ui_preferences: get().uiPreferences
      };
      
      // First check if a record already exists
      const { data: existingLayout } = await supabase
        .from('chat_ui_layout')
        .select('id')
        .eq('user_id', userId)
        .single();
        
      if (existingLayout) {
        // Update existing record
        const { error } = await supabase
          .from('chat_ui_layout')
          .update(layout)
          .eq('id', existingLayout.id);
          
        if (error) throw error;
      } else {
        // Insert new record
        const { error } = await supabase
          .from('chat_ui_layout')
          .insert({
            ...layout,
            user_id: userId
          });
          
        if (error) throw error;
      }
      
      // Also save to localStorage as fallback
      localStorage.setItem('chat_layout', JSON.stringify({
        ...layout,
        user_id: userId
      }));
      
      logger.info('Saved chat layout to storage');
      return true;
    } catch (error) {
      logger.error('Failed to save layout to storage', { error });
      return false;
    }
  },
  
  loadLayoutFromStorage: async () => {
    try {
      const userId = (await supabase.auth.getUser()).data.user?.id;
      
      // Try to load from Supabase if user is logged in
      if (userId) {
        const { data, error } = await supabase
          .from('chat_ui_layout')
          .select('*')
          .eq('user_id', userId)
          .single();
          
        if (error) {
          // If no record found, try localStorage
          const localLayout = localStorage.getItem('chat_layout');
          if (localLayout) {
            const parsedLayout = JSON.parse(localLayout);
            set({
              isMinimized: parsedLayout.is_minimized || false,
              docked: parsedLayout.docked || true,
              position: parsedLayout.position || { x: 0, y: 0 },
              scale: parsedLayout.scale || 1,
              dockedItems: parsedLayout.docked_items || {},
              uiPreferences: parsedLayout.ui_preferences || defaultUIPreferences
            });
            return true;
          }
          return false;
        }
        
        if (data) {
          set({
            isMinimized: data.is_minimized || false,
            docked: data.docked || true,
            position: data.position || { x: 0, y: 0 },
            scale: data.scale || 1,
            dockedItems: data.docked_items || {},
            uiPreferences: data.ui_preferences || defaultUIPreferences
          });
          logger.info('Loaded chat layout from database');
          return true;
        }
      } else {
        // Try localStorage for non-logged in users
        const localLayout = localStorage.getItem('chat_layout');
        if (localLayout) {
          const parsedLayout = JSON.parse(localLayout);
          set({
            isMinimized: parsedLayout.is_minimized || false,
            docked: parsedLayout.docked || true,
            position: parsedLayout.position || { x: 0, y: 0 },
            scale: parsedLayout.scale || 1,
            dockedItems: parsedLayout.docked_items || {},
            uiPreferences: parsedLayout.ui_preferences || defaultUIPreferences
          });
          return true;
        }
      }
      
      return false;
    } catch (error) {
      logger.error('Failed to load layout from storage', { error });
      return false;
    }
  }
}));

// Initialize on mount if in browser context
if (typeof window !== 'undefined') {
  useChatLayoutStore.getState().loadLayoutFromStorage().catch(() => {
    logger.warn('Failed to load layout, using defaults');
  });
}
