
/**
 * Export all chat UI state management
 */

// Atoms
export * from './atoms';

// Hooks
import { useAtom } from 'jotai';
import {
  isOpenAtom,
  isMinimizedAtom,
  isDockedAtom,
  positionAtom,
  scaleAtom,
  showSidebarAtom,
  themeAtom,
  chatPreferencesAtom,
  toggleOpenAtom,
  toggleMinimizedAtom,
  toggleDockedAtom,
  toggleSidebarAtom,
  resetLayoutAtom,
  resetPreferencesAtom
} from './atoms';

/**
 * Hook for accessing chat layout state
 * Provides a unified API for chat layout state management
 */
export function useChatLayout() {
  const [isOpen, setIsOpen] = useAtom(isOpenAtom);
  const [isMinimized, setIsMinimized] = useAtom(isMinimizedAtom);
  const [docked, setDocked] = useAtom(isDockedAtom);
  const [position, setPosition] = useAtom(positionAtom);
  const [scale, setScale] = useAtom(scaleAtom);
  const [showSidebar, setShowSidebar] = useAtom(showSidebarAtom);
  const [theme, setTheme] = useAtom(themeAtom);
  const [uiPreferences, setPreferences] = useAtom(chatPreferencesAtom);
  
  // Actions
  const [, toggleOpen] = useAtom(toggleOpenAtom);
  const [, toggleMinimize] = useAtom(toggleMinimizedAtom);
  const [, toggleDocked] = useAtom(toggleDockedAtom);
  const [, toggleSidebar] = useAtom(toggleSidebarAtom);
  const [, resetLayout] = useAtom(resetLayoutAtom);
  const [, resetPreferences] = useAtom(resetPreferencesAtom);
  
  return {
    // State
    isOpen,
    isMinimized,
    docked,
    position,
    scale,
    showSidebar,
    theme,
    uiPreferences,
    
    // Setters
    setIsOpen,
    setIsMinimized,
    setDocked,
    setPosition,
    setScale,
    setShowSidebar,
    setTheme,
    setPreferences,
    
    // Toggle actions
    toggleOpen,
    toggleMinimize,
    toggleDocked,
    toggleSidebar,
    
    // Reset actions
    resetLayout,
    resetPreferences,
    resetAll: () => {
      resetLayout();
      resetPreferences();
    }
  };
}
