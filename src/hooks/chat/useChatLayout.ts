
import { useEffect } from 'react';
import { useChatLayoutStore } from '@/components/chat/store/chatLayoutStore';
import { toast } from 'sonner';

/**
 * Hook for accessing and managing chat layout state
 */
export function useChatLayout() {
  const {
    isMinimized,
    docked,
    position,
    scale,
    showSidebar,
    dockedItems,
    uiPreferences,
    setMinimized,
    toggleMinimized,
    setDocked,
    toggleDocked,
    setPosition,
    setScale,
    toggleSidebar,
    setSidebar,
    setDockedItem,
    updateUIPreferences,
    saveLayoutToStorage,
    loadLayoutFromStorage,
    resetLayout
  } = useChatLayoutStore();

  // Save layout changes to storage
  useEffect(() => {
    const saveTimeout = setTimeout(() => {
      saveLayoutToStorage().catch(error => {
        console.error('Failed to save layout:', error);
      });
    }, 1000);

    return () => clearTimeout(saveTimeout);
  }, [isMinimized, docked, position, scale, showSidebar, dockedItems, uiPreferences, saveLayoutToStorage]);

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
  const setTheme = (theme: string) => {
    updateUIPreferences({ theme });
  };

  /**
   * Update font size
   */
  const setFontSize = (fontSize: string) => {
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
    isMinimized,
    docked,
    position,
    scale,
    showSidebar,
    dockedItems,
    uiPreferences,
    
    // Basic actions
    setMinimized,
    toggleMinimized,
    setDocked,
    toggleDocked,
    setPosition,
    setScale,
    toggleSidebar,
    setSidebar,
    setDockedItem,
    
    // Enhanced actions
    saveCurrentLayout,
    resetLayoutWithConfirmation,
    setTheme,
    setFontSize,
    setUIPreference
  };
}

export default useChatLayout;
