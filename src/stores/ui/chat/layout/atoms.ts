import { supabase } from '@/integrations/supabase/client';
import { logger } from '@/services/chat/LoggingService';
import { toJson } from '@/types/supabase';
import { atom, Getter, Setter } from 'jotai';
import { atomWithStorage } from 'jotai/utils';
import { ChatLayoutState, ChatUIPreferences } from './types';

// Storage key constants
const STORAGE_KEYS = {
  IS_MINIMIZED: 'chat-is-minimized',
  SCALE: 'chat-scale',
  SHOW_SIDEBAR: 'chat-show-sidebar',
  UI_PREFERENCES: 'chat-ui-preferences'
} as const;

// Default UI preferences
const defaultUIPreferences: ChatUIPreferences = {
  theme: 'dark',
  fontSize: 'medium',
  messageBehavior: 'enter_send',
  notifications: true,
  showTimestamps: true
};

// Base atoms
export const isMinimizedAtom = atomWithStorage<boolean>(STORAGE_KEYS.IS_MINIMIZED, false);
export const scaleAtom = atomWithStorage<number>(STORAGE_KEYS.SCALE, 1);
export const showSidebarAtom = atomWithStorage<boolean>(STORAGE_KEYS.SHOW_SIDEBAR, false);
export const uiPreferencesAtom = atomWithStorage<ChatUIPreferences>(STORAGE_KEYS.UI_PREFERENCES, defaultUIPreferences);

// Derived atom for the entire layout state
export const layoutStateAtom = atom((get: Getter): ChatLayoutState => ({
  isMinimized: get(isMinimizedAtom),
  scale: get(scaleAtom),
  showSidebar: get(showSidebarAtom),
  uiPreferences: get(uiPreferencesAtom)
}));

// Action atoms
export const toggleMinimizedAtom = atom(
  null,
  (get: Getter, set: Setter) => {
    set(isMinimizedAtom, !get(isMinimizedAtom));
  }
);

export const setMinimizedAtom = atom(
  null,
  (get: Getter, set: Setter, isMinimized: boolean) => {
    set(isMinimizedAtom, isMinimized);
  }
);

export const setScaleAtom = atom(
  null,
  (get: Getter, set: Setter, scale: number) => {
    set(scaleAtom, scale);
  }
);

export const toggleSidebarAtom = atom(
  null,
  (get: Getter, set: Setter) => {
    set(showSidebarAtom, !get(showSidebarAtom));
  }
);

export const setSidebarAtom = atom(
  null,
  (get: Getter, set: Setter, visible: boolean) => {
    set(showSidebarAtom, visible);
  }
);

export const updateUIPreferencesAtom = atom(
  null,
  (get: Getter, set: Setter, preferences: Partial<ChatUIPreferences>) => {
    set(uiPreferencesAtom, { ...get(uiPreferencesAtom), ...preferences });
  }
);

export const resetLayoutAtom = atom(
  null,
  (get: Getter, set: Setter) => {
    set(isMinimizedAtom, false);
    set(scaleAtom, 1);
    set(showSidebarAtom, false);
    set(uiPreferencesAtom, defaultUIPreferences);
  }
);

// Persistence atoms
export const saveLayoutToStorageAtom = atom(
  null,
  async (get: Getter) => {
    try {
      const userId = (await supabase.auth.getUser()).data.user?.id;
      if (!userId) return false;

      const layout = {
        is_minimized: get(isMinimizedAtom),
        scale: get(scaleAtom),
        show_sidebar: get(showSidebarAtom),
        ui_preferences: toJson(get(uiPreferencesAtom))
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

      logger.info('Saved chat layout to storage');
      return true;
    } catch (error) {
      logger.error('Failed to save layout to storage', { error });
      return false;
    }
  }
);

export const loadLayoutFromStorageAtom = atom(
  null,
  async (get: Getter, set: Setter) => {
    try {
      const userId = (await supabase.auth.getUser()).data.user?.id;

      // Try to load from Supabase if user is logged in
      if (userId) {
        const { data, error } = await supabase
          .from('chat_ui_layout')
          .select('*')
          .eq('user_id', userId)
          .single();

        if (!error && data) {
          set(isMinimizedAtom, data.is_minimized || false);
          set(scaleAtom, data.scale || 1);
          set(showSidebarAtom, data.show_sidebar || false);

          // Parse ui_preferences or use defaults
          let uiPrefs = defaultUIPreferences;
          if (data.ui_preferences) {
            try {
              if (typeof data.ui_preferences === 'string') {
                uiPrefs = { ...uiPrefs, ...JSON.parse(data.ui_preferences) };
              } else if (typeof data.ui_preferences === 'object') {
                uiPrefs = { ...uiPrefs, ...data.ui_preferences };
              }
            } catch (e) {
              logger.warn('Failed to parse UI preferences', { error: e });
            }
          }

          set(uiPreferencesAtom, uiPrefs);

          logger.info('Loaded chat layout from database');
          return true;
        }
      }

      return false;
    } catch (error) {
      logger.error('Failed to load layout from storage', { error });
      return false;
    }
  }
);

// Hook to initialize layout
export const initializeLayoutAtom = atom(
  null,
  async (get: Getter, set: Setter) => {
    // Try to load from storage, use defaults if failed
    const success = await set(loadLayoutFromStorageAtom);
    if (!success) {
      logger.info('Using default layout settings');
    }
  }
);
