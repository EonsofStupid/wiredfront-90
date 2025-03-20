import { supabase } from '@/integrations/supabase/client';
import { logger } from '@/services/chat/LoggingService';
import { toJson } from '@/types/supabase';
import { atom } from 'jotai';
import { atomWithStorage } from 'jotai/utils';
// Storage key constants
const STORAGE_KEYS = {
    LAYOUT_PREFERENCES: 'chat-layout-preferences',
    SCALE: 'chat-scale',
    SIDEBAR: 'chat-sidebar'
};
// Default preferences
const DEFAULT_PREFERENCES = {
    theme: 'dark',
    fontSize: 'medium',
    messageBehavior: 'enter_send',
    notifications: true,
    showTimestamps: true
};
// Base atoms
export const isMinimizedAtom = atom(false);
export const scaleAtom = atomWithStorage(STORAGE_KEYS.SCALE, 1);
export const showSidebarAtom = atomWithStorage(STORAGE_KEYS.SIDEBAR, false);
export const preferencesAtom = atomWithStorage(STORAGE_KEYS.LAYOUT_PREFERENCES, DEFAULT_PREFERENCES);
// Derived atom for the entire layout state
export const chatLayoutStateAtom = atom((get) => ({
    isMinimized: get(isMinimizedAtom),
    scale: get(scaleAtom),
    showSidebar: get(showSidebarAtom),
    uiPreferences: get(preferencesAtom)
}));
// Action atoms
export const toggleMinimizedAtom = atom(null, (get, set) => {
    const current = get(isMinimizedAtom);
    set(isMinimizedAtom, !current);
});
export const setMinimizedAtom = atom(null, (_, set, isMinimized) => {
    set(isMinimizedAtom, isMinimized);
});
export const setScaleAtom = atom(null, (_, set, scale) => {
    set(scaleAtom, scale);
});
export const toggleSidebarAtom = atom(null, (get, set) => {
    const current = get(showSidebarAtom);
    set(showSidebarAtom, !current);
});
export const setSidebarAtom = atom(null, (_, set, show) => {
    set(showSidebarAtom, show);
});
export const updatePreferencesAtom = atom(null, (get, set, preferences) => {
    const current = get(preferencesAtom);
    set(preferencesAtom, { ...current, ...preferences });
});
// Reset atom
export const resetLayoutAtom = atom(null, (get, set) => {
    set(isMinimizedAtom, false);
    set(scaleAtom, 1);
    set(showSidebarAtom, false);
    set(preferencesAtom, DEFAULT_PREFERENCES);
});
// Persistence atoms
export const saveLayoutToStorageAtom = atom(null, async (get) => {
    try {
        const userId = (await supabase.auth.getUser()).data.user?.id;
        if (!userId)
            return false;
        const layout = {
            is_minimized: get(isMinimizedAtom),
            scale: get(scaleAtom),
            show_sidebar: get(showSidebarAtom),
            ui_preferences: toJson(get(preferencesAtom))
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
            if (error)
                throw error;
        }
        else {
            // Insert new record
            const { error } = await supabase
                .from('chat_ui_layout')
                .insert({
                ...layout,
                user_id: userId
            });
            if (error)
                throw error;
        }
        logger.info('Saved chat layout to storage');
        return true;
    }
    catch (error) {
        logger.error('Failed to save layout to storage', { error });
        return false;
    }
});
export const loadLayoutFromStorageAtom = atom(null, async (get, set) => {
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
                let uiPrefs = DEFAULT_PREFERENCES;
                if (data.ui_preferences) {
                    try {
                        if (typeof data.ui_preferences === 'string') {
                            uiPrefs = { ...uiPrefs, ...JSON.parse(data.ui_preferences) };
                        }
                        else if (typeof data.ui_preferences === 'object') {
                            uiPrefs = { ...uiPrefs, ...data.ui_preferences };
                        }
                    }
                    catch (e) {
                        logger.warn('Failed to parse UI preferences', { error: e });
                    }
                }
                set(preferencesAtom, uiPrefs);
                logger.info('Loaded chat layout from database');
                return true;
            }
        }
        return false;
    }
    catch (error) {
        logger.error('Failed to load layout from storage', { error });
        return false;
    }
});
// Hook to initialize layout
export const initializeLayoutAtom = atom(null, async (get, set) => {
    // Try to load from storage, use defaults if failed
    const success = await set(loadLayoutFromStorageAtom);
    if (!success) {
        logger.info('Using default layout settings');
    }
});
