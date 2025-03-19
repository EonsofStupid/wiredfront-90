
import { atom } from 'jotai';
import { atomWithStorage } from 'jotai/utils';
import { DockPosition } from '@/types/chat/ui';
import { ChatPosition } from '@/types/chat/ui';
import { supabase } from '@/integrations/supabase/client';
import { logger } from '@/services/chat/LoggingService';
import { toJson } from '@/types/supabase';

// Default values
const defaultPosition: ChatPosition = { x: 0, y: 0 };

// Base atoms
export const dockedAtom = atomWithStorage('chat-docked', true);
export const positionAtom = atomWithStorage<ChatPosition>('chat-position', defaultPosition);
export const dockedItemsAtom = atomWithStorage<Record<string, DockPosition>>('chat-docked-items', {});

// Derived state atom
export const dockingStateAtom = atom((get) => ({
  docked: get(dockedAtom),
  position: get(positionAtom),
  dockedItems: get(dockedItemsAtom)
}));

// Action atoms
export const setDockedAtom = atom(
  null,
  (get, set, docked: boolean) => {
    set(dockedAtom, docked);
  }
);

export const toggleDockedAtom = atom(
  null,
  (get, set) => {
    set(dockedAtom, !get(dockedAtom));
  }
);

export const setPositionAtom = atom(
  null,
  (get, set, position: ChatPosition) => {
    set(positionAtom, position);
  }
);

export const setDockedItemAtom = atom(
  null,
  (get, set, payload: { id: string, position: DockPosition }) => {
    const { id, position } = payload;
    set(dockedItemsAtom, { ...get(dockedItemsAtom), [id]: position });
  }
);

export const resetDockingAtom = atom(
  null,
  (get, set) => {
    set(dockedAtom, true);
    set(positionAtom, defaultPosition);
    set(dockedItemsAtom, {});
  }
);

// Persistence atoms
export const saveDockingToStorageAtom = atom(
  null,
  async (get) => {
    try {
      const userId = (await supabase.auth.getUser()).data.user?.id;
      if (!userId) return false;
      
      const docking = {
        docked: get(dockedAtom),
        position: toJson(get(positionAtom)),
        docked_items: toJson(get(dockedItemsAtom))
      };
      
      // First check if a record already exists
      const { data: existingDocking } = await supabase
        .from('chat_ui_docking')
        .select('id')
        .eq('user_id', userId)
        .single();
        
      if (existingDocking) {
        // Update existing record
        const { error } = await supabase
          .from('chat_ui_docking')
          .update(docking)
          .eq('id', existingDocking.id);
          
        if (error) throw error;
      } else {
        // Insert new record
        const { error } = await supabase
          .from('chat_ui_docking')
          .insert({
            ...docking,
            user_id: userId
          });
          
        if (error) throw error;
      }
      
      logger.info('Saved chat docking to storage');
      return true;
    } catch (error) {
      logger.error('Failed to save docking to storage', { error });
      return false;
    }
  }
);

export const loadDockingFromStorageAtom = atom(
  null,
  async (get, set) => {
    try {
      const userId = (await supabase.auth.getUser()).data.user?.id;
      
      // Try to load from Supabase if user is logged in
      if (userId) {
        const { data, error } = await supabase
          .from('chat_ui_docking')
          .select('*')
          .eq('user_id', userId)
          .single();
          
        if (!error && data) {
          set(dockedAtom, data.docked);
          
          // Parse position or use default
          let position = defaultPosition;
          if (data.position) {
            try {
              if (typeof data.position === 'string') {
                position = JSON.parse(data.position);
              } else if (typeof data.position === 'object') {
                position = data.position as ChatPosition;
              }
            } catch (e) {
              logger.warn('Failed to parse position', { error: e });
            }
          }
          set(positionAtom, position);
          
          // Parse docked_items or use empty object
          let dockedItems = {};
          if (data.docked_items) {
            try {
              if (typeof data.docked_items === 'string') {
                dockedItems = JSON.parse(data.docked_items);
              } else if (typeof data.docked_items === 'object') {
                dockedItems = data.docked_items;
              }
            } catch (e) {
              logger.warn('Failed to parse docked items', { error: e });
            }
          }
          set(dockedItemsAtom, dockedItems as Record<string, DockPosition>);
          
          logger.info('Loaded chat docking from database');
          return true;
        }
      }
      
      return false;
    } catch (error) {
      logger.error('Failed to load docking from storage', { error });
      return false;
    }
  }
);

// Hook to initialize docking
export const initializeDockingAtom = atom(
  null,
  async (get, set) => {
    // Try to load from storage, use defaults if failed
    const success = await set(loadDockingFromStorageAtom);
    if (!success) {
      logger.info('Using default docking settings');
    }
  }
);
