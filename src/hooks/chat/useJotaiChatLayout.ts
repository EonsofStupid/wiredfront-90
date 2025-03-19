
import { useAtom, useAtomValue, useSetAtom } from 'jotai';
import { useEffect } from 'react';
import { toast } from 'sonner';
import {
  isMinimizedAtom,
  scaleAtom,
  showSidebarAtom,
  uiPreferencesAtom,
  toggleMinimizedAtom,
  setMinimizedAtom,
  setScaleAtom,
  toggleSidebarAtom,
  setSidebarAtom,
  updateUIPreferencesAtom,
  resetLayoutAtom,
  saveLayoutToStorageAtom,
  loadLayoutFromStorageAtom,
  initializeLayoutAtom,
  layoutStateAtom
} from '@/stores';
import { ChatTheme } from '@/types/chat/ui';

/**
 * Hook for accessing and managing chat layout state using Jotai
 */
export function useJotaiChatLayout() {
  // Get state
  const layoutState = useAtomValue(layoutStateAtom);
  const [isMinimized, setIsMinimized] = useAtom(isMinimizedAtom);
  const [scale, setScale] = useAtom(scaleAtom);
  const [showSidebar, setShowSidebar] = useAtom(showSidebarAtom);
  const [uiPreferences, setUIPreferences] = useAtom(uiPreferencesAtom);
  
  // Get actions
  const toggleMinimized = useSetAtom(toggleMinimizedAtom);
  const toggleSidebar = useSetAtom(toggleSidebarAtom);
  const resetLayout = useSetAtom(resetLayoutAtom);
  const saveLayoutToStorage = useSetAtom(saveLayoutToStorageAtom);
  const loadLayoutFromStorage = useSetAtom(loadLayoutFromStorageAtom);
  const initializeLayout = useSetAtom(initializeLayoutAtom);
  const updateUIPreferences = useSetAtom(updateUIPreferencesAtom);
  
  // Initialize layout on mount
  useEffect(() => {
    initializeLayout();
  }, [initializeLayout]);

  // Save layout changes to storage
  useEffect(() => {
    const saveTimeout = setTimeout(() => {
      saveLayoutToStorage();
    }, 1000);

    return () => clearTimeout(saveTimeout);
  }, [isMinimized, scale, showSidebar, uiPreferences, saveLayoutToStorage]);

  /**
   * Save current layout with custom logic
   */
  const saveCurrentLayout = async () => {
    try {
      await saveLayoutToStorage();
      toast.success('Layout saved');
      return true;
    } catch (error) {
      toast.error('Failed to save layout');
      console.error('Error saving layout:', error);
      return false;
    }
  };

  /**
   * Reset layout with custom logic
   */
  const resetLayoutWithConfirmation = async () => {
    resetLayout();
    await saveLayoutToStorage();
    toast.success('Layout reset to defaults');
    return true;
  };

  /**
   * Update theme
   */
  const setTheme = (theme: ChatTheme) => {
    updateUIPreferences({ theme });
  };

  /**
   * Update font size
   */
  const setFontSize = (fontSize: 'small' | 'medium' | 'large') => {
    updateUIPreferences({ fontSize });
  };

  /**
   * Change UI preference
   */
  const setUIPreference = <K extends keyof typeof uiPreferences>(
    key: K,
    value: typeof uiPreferences[K]
  ) => {
    updateUIPreferences({ [key]: value } as any);
  };

  return {
    // State
    ...layoutState,
    
    // Basic actions
    setMinimized: setIsMinimized,
    toggleMinimized,
    setScale,
    toggleSidebar,
    setSidebar: setShowSidebar,
    
    // Enhanced actions
    saveCurrentLayout,
    resetLayoutWithConfirmation,
    setTheme,
    setFontSize,
    setUIPreference
  };
}

export default useJotaiChatLayout;
