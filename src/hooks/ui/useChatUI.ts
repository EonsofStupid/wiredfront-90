
import { useChatStore } from '@/components/chat/store/chatStore';
import { useThemeController } from '@/services/theme/ThemeController';
import { useCallback, useEffect } from 'react';

/**
 * Hook for managing chat UI state and interactions
 */
export function useChatUI() {
  const {
    isOpen,
    isMinimized,
    toggleChat,
    toggleMinimize,
    position,
    scale,
    setScale,
    showSidebar,
    toggleSidebar,
  } = useChatStore();

  const { applyTheme, variables } = useThemeController();

  // Apply theme when component mounts
  useEffect(() => {
    applyTheme();
  }, [applyTheme]);

  // Handle responsive scaling
  const adjustScale = useCallback((scaleValue: number) => {
    setScale(scaleValue);
  }, [setScale]);

  // Monitor window size for responsive adjustments
  useEffect(() => {
    const handleResize = () => {
      // Simple responsive scaling logic
      const width = window.innerWidth;
      if (width < 640) { // Mobile
        adjustScale(0.85);
      } else if (width < 1024) { // Tablet
        adjustScale(0.9);
      } else { // Desktop
        adjustScale(1);
      }
    };

    window.addEventListener('resize', handleResize);
    handleResize(); // Initial check
    
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, [adjustScale]);

  // Keyboard shortcuts for chat interactions
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Escape to close/minimize chat
      if (e.key === 'Escape' && isOpen && !isMinimized) {
        toggleMinimize();
      }
      
      // Cmd/Ctrl + / to toggle chat
      if ((e.metaKey || e.ctrlKey) && e.key === '/') {
        e.preventDefault();
        toggleChat();
      }
    };
    
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, isMinimized, toggleChat, toggleMinimize]);

  return {
    isOpen,
    isMinimized,
    toggleChat,
    toggleMinimize,
    position,
    scale,
    showSidebar,
    toggleSidebar,
    themeVariables: variables
  };
}
