
import { useAtom, useAtomValue, useSetAtom } from 'jotai';
import { useEffect } from 'react';
import { toast } from 'sonner';
import {
  dockedAtom,
  positionAtom,
  dockedItemsAtom,
  setDockedAtom,
  toggleDockedAtom,
  setPositionAtom,
  setDockedItemAtom,
  resetDockingAtom,
  saveDockingToStorageAtom,
  loadDockingFromStorageAtom,
  initializeDockingAtom,
  dockingStateAtom
} from '@/stores';
import { DockPosition } from '@/types/chat/ui';
import { ChatPosition } from '@/types/chat/ui';

/**
 * Hook for accessing and managing chat docking state using Jotai
 */
export function useJotaiChatDocking() {
  // Get state
  const dockingState = useAtomValue(dockingStateAtom);
  const [docked, setDocked] = useAtom(dockedAtom);
  const [position, setPosition] = useAtom(positionAtom);
  const [dockedItems, setDockedItems] = useAtom(dockedItemsAtom);
  
  // Get actions
  const toggleDocked = useSetAtom(toggleDockedAtom);
  const setDockedItem = useSetAtom(setDockedItemAtom);
  const resetDocking = useSetAtom(resetDockingAtom);
  const saveDockingToStorage = useSetAtom(saveDockingToStorageAtom);
  const loadDockingFromStorage = useSetAtom(loadDockingFromStorageAtom);
  const initializeDocking = useSetAtom(initializeDockingAtom);
  
  // Initialize docking on mount
  useEffect(() => {
    initializeDocking();
  }, [initializeDocking]);

  // Save docking changes to storage
  useEffect(() => {
    const saveTimeout = setTimeout(() => {
      saveDockingToStorage();
    }, 1000);

    return () => clearTimeout(saveTimeout);
  }, [docked, position, dockedItems, saveDockingToStorage]);

  /**
   * Save current docking settings with custom logic
   */
  const saveCurrentDocking = async () => {
    try {
      await saveDockingToStorage();
      toast.success('Docking settings saved');
      return true;
    } catch (error) {
      toast.error('Failed to save docking settings');
      console.error('Error saving docking settings:', error);
      return false;
    }
  };

  /**
   * Reset docking settings with custom logic
   */
  const resetDockingWithConfirmation = async () => {
    resetDocking();
    await saveDockingToStorage();
    toast.success('Docking settings reset to defaults');
    return true;
  };

  /**
   * Set docked item position with type safety
   */
  const setDockPosition = (id: string, position: DockPosition) => {
    setDockedItem({ id, position });
  };

  return {
    // State
    ...dockingState,
    
    // Basic actions
    setDocked,
    toggleDocked,
    setPosition,
    
    // Enhanced actions
    setDockedItem: setDockPosition,
    saveCurrentDocking,
    resetDockingWithConfirmation
  };
}

export default useJotaiChatDocking;
