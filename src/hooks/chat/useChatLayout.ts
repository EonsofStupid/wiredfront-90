
import { useEffect, useState } from 'react';
import { useChatLayoutStore } from '@/components/chat/store/chatLayoutStore';
import { ChatPosition, ChatUIPreferences } from '@/types/chat/ui';
import { logger } from '@/services/chat/LoggingService';

/**
 * Hook for managing chat layout preferences with persistence
 */
export function useChatLayout() {
  const {
    isMinimized,
    docked,
    position,
    scale,
    showSidebar,
    uiPreferences,
    setMinimized,
    toggleMinimized,
    setDocked,
    toggleDocked,
    setPosition,
    setScale,
    toggleSidebar,
    setSidebar,
    updateUIPreferences,
    saveLayoutToStorage,
    loadLayoutFromStorage
  } = useChatLayoutStore();
  
  const [isLoaded, setIsLoaded] = useState(false);
  
  // Load saved layout on mount
  useEffect(() => {
    if (!isLoaded) {
      loadLayoutFromStorage()
        .then(success => {
          setIsLoaded(true);
          if (!success) {
            logger.info('No saved layout found, using defaults');
          }
        })
        .catch(error => {
          logger.error('Error loading layout', { error });
          setIsLoaded(true);
        });
    }
  }, [isLoaded, loadLayoutFromStorage]);
  
  // Save layout changes
  const saveLayout = async () => {
    const success = await saveLayoutToStorage();
    return success;
  };
  
  // Save on important changes
  useEffect(() => {
    if (isLoaded) {
      const saveTimer = setTimeout(() => {
        saveLayout();
      }, 1000);
      
      return () => clearTimeout(saveTimer);
    }
  }, [isLoaded, docked, isMinimized, position, uiPreferences]);
  
  // Handle window resizing
  useEffect(() => {
    const handleResize = () => {
      // If window is smaller than 768px, ensure proper mobile layout
      if (window.innerWidth < 768 && !docked) {
        setDocked(true);
      }
    };
    
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [docked, setDocked]);
  
  return {
    // State values
    isMinimized,
    docked,
    position,
    scale,
    showSidebar,
    uiPreferences,
    
    // Simple actions
    setMinimized,
    toggleMinimized,
    setDocked,
    toggleDocked,
    setSidebar,
    toggleSidebar,
    
    // Complex setters
    setPosition,
    setScale,
    updateUIPreferences,
    
    // Wrapper for safer position setting
    updatePosition: (newPosition: Partial<ChatPosition>) => {
      setPosition({
        x: newPosition.x !== undefined ? newPosition.x : position.x,
        y: newPosition.y !== undefined ? newPosition.y : position.y
      });
    },
    
    // Theme helpers
    setTheme: (theme: ChatUIPreferences['theme']) => {
      updateUIPreferences({ theme });
    },
    
    // Save manually
    saveLayout
  };
}

export default useChatLayout;
