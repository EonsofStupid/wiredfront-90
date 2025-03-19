
import { create } from 'zustand';
import { logger } from '@/services/chat/LoggingService';
import { supabase } from '@/integrations/supabase/client';

export type DockPosition = 'left' | 'right' | 'bottom' | 'floating' | 'hidden';

interface DockedItem {
  position: DockPosition;
  order: number;
}

interface UIPreferences {
  theme: 'light' | 'dark' | 'system';
  fontSize: 'small' | 'medium' | 'large';
  messageBehavior: 'enter_send' | 'ctrl_enter';
  notifications: boolean;
  soundEnabled: boolean;
}

interface ChatLayoutState {
  // Core state
  dockedItems: Record<string, DockedItem>;
  dockedSections: Record<string, DockedItem>;
  uiPreferences: UIPreferences;
  
  // Loading state
  isLoading: boolean;
  
  // Actions
  setDockedItem: (itemId: string, position: DockPosition, order?: number) => void;
  setDockedSection: (sectionId: string, position: DockPosition, order?: number) => void;
  updateUIPreferences: (updates: Partial<UIPreferences>) => void;
  
  // Database integration
  saveLayoutToDatabase: () => Promise<boolean>;
  loadLayoutFromDatabase: () => Promise<boolean>;
  resetLayout: () => void;
}

const DEFAULT_UI_PREFERENCES: UIPreferences = {
  theme: 'dark',
  fontSize: 'medium',
  messageBehavior: 'enter_send',
  notifications: true,
  soundEnabled: true,
};

/**
 * Central store for chat layout and UI preferences
 */
export const useChatLayoutStore = create<ChatLayoutState>((set, get) => ({
  // Default state
  dockedItems: {},
  dockedSections: {},
  uiPreferences: { ...DEFAULT_UI_PREFERENCES },
  isLoading: false,
  
  // Actions
  setDockedItem: (itemId, position, order = 0) => {
    set(state => ({
      dockedItems: {
        ...state.dockedItems,
        [itemId]: { position, order }
      }
    }));
  },
  
  setDockedSection: (sectionId, position, order = 0) => {
    set(state => ({
      dockedSections: {
        ...state.dockedSections,
        [sectionId]: { position, order }
      }
    }));
  },
  
  updateUIPreferences: (updates) => {
    set(state => ({
      uiPreferences: {
        ...state.uiPreferences,
        ...updates
      }
    }));
  },
  
  // Database integration
  saveLayoutToDatabase: async () => {
    const state = get();
    const { dockedItems, dockedSections, uiPreferences } = state;
    
    try {
      // First, get the current user
      const { data: userData } = await supabase.auth.getUser();
      if (!userData.user) {
        throw new Error('User not authenticated');
      }
      
      // Get existing layout or create new one
      const { data: existingLayout, error: fetchError } = await supabase
        .from('chat_ui_layout')
        .select('*')
        .eq('user_id', userData.user.id)
        .single();
      
      if (fetchError && fetchError.code !== 'PGRST116') {
        // PGRST116 means "no rows found" which is fine for new users
        throw fetchError;
      }
      
      // Prepare layout data
      const layoutData = {
        user_id: userData.user.id,
        docked_items: dockedItems,
        metadata: {
          sections: dockedSections
        },
        ui_preferences: uiPreferences
      };
      
      // Save to database
      let saveError;
      if (existingLayout) {
        const { error } = await supabase
          .from('chat_ui_layout')
          .update(layoutData)
          .eq('id', existingLayout.id);
        saveError = error;
      } else {
        const { error } = await supabase
          .from('chat_ui_layout')
          .insert([layoutData]);
        saveError = error;
      }
      
      if (saveError) throw saveError;
      logger.info('Saved chat layout to database');
      return true;
    } catch (error) {
      logger.error('Failed to save chat layout', { error });
      return false;
    }
  },
  
  loadLayoutFromDatabase: async () => {
    set({ isLoading: true });
    
    try {
      // Get the current user
      const { data: userData } = await supabase.auth.getUser();
      if (!userData.user) {
        throw new Error('User not authenticated');
      }
      
      // Fetch user's layout
      const { data, error } = await supabase
        .from('chat_ui_layout')
        .select('*')
        .eq('user_id', userData.user.id)
        .single();
      
      if (error) {
        if (error.code === 'PGRST116') {
          // No layout found, use defaults
          return true;
        }
        throw error;
      }
      
      // Update state with fetched layout
      set({
        dockedItems: data.docked_items || {},
        dockedSections: data.metadata?.sections || {},
        uiPreferences: data.ui_preferences || DEFAULT_UI_PREFERENCES
      });
      
      logger.info('Loaded chat layout from database');
      return true;
    } catch (error) {
      logger.error('Failed to load chat layout', { error });
      return false;
    } finally {
      set({ isLoading: false });
    }
  },
  
  resetLayout: () => {
    set({
      dockedItems: {},
      dockedSections: {},
      uiPreferences: { ...DEFAULT_UI_PREFERENCES }
    });
  }
}));

// Initialize layout from localStorage as fallback if available
if (typeof window !== 'undefined') {
  try {
    const savedLayout = localStorage.getItem('wired_front_chat_layout');
    
    if (savedLayout) {
      const parsedLayout = JSON.parse(savedLayout);
      useChatLayoutStore.setState({
        dockedItems: parsedLayout.dockedItems || {},
        dockedSections: parsedLayout.dockedSections || {},
        uiPreferences: parsedLayout.uiPreferences || DEFAULT_UI_PREFERENCES
      });
    }
  } catch (error) {
    logger.error('Failed to initialize chat layout from localStorage', { error });
  }
}

// Setup autosave to localStorage
if (typeof window !== 'undefined') {
  useChatLayoutStore.subscribe((state) => {
    try {
      const { dockedItems, dockedSections, uiPreferences } = state;
      localStorage.setItem('wired_front_chat_layout', JSON.stringify({
        dockedItems, 
        dockedSections,
        uiPreferences
      }));
    } catch (error) {
      logger.error('Failed to save chat layout to localStorage', { error });
    }
  });
}
