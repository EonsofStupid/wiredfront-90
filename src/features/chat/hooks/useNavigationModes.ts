
import { useCallback } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { ChatMode, CHAT_MODE_DESCRIPTIONS, CHAT_MODE_DISPLAY_NAMES } from '@/types/chat/modes';
import { useChatModeStore } from '../store/chatModeStore';

/**
 * Hook for navigating between different chat modes with bi-directional sync
 */
export const useNavigationModes = () => {
  const { currentMode, setMode } = useChatModeStore();
  const navigate = useNavigate();
  const location = useLocation();

  // Convert the current path to a mode
  const pathToMode = useCallback((path: string): ChatMode => {
    if (path.includes('/dev') || path.includes('/code')) return 'dev';
    if (path.includes('/image') || path.includes('/gallery')) return 'image';
    if (path.includes('/training') || path.includes('/learn')) return 'training';
    if (path.includes('/planning') || path.includes('/project')) return 'planning';
    return 'chat';
  }, []);

  // Convert a mode to a path
  const modeToPath = useCallback((mode: ChatMode): string => {
    switch (mode) {
      case 'dev': return '/dev';
      case 'image': return '/gallery';
      case 'training': return '/training';
      case 'planning': return '/planning';
      default: return '/';
    }
  }, []);

  // Change the chat mode and optionally navigate
  const changeMode = useCallback((mode: ChatMode, shouldNavigate = false) => {
    setMode(mode);
    
    if (shouldNavigate) {
      const path = modeToPath(mode);
      navigate(path);
    }
  }, [setMode, navigate, modeToPath]);

  // Sync the page with the current mode
  const syncPageWithMode = useCallback(() => {
    const modePath = modeToPath(currentMode);
    if (location.pathname !== modePath) {
      navigate(modePath);
    }
  }, [currentMode, location.pathname, navigate, modeToPath]);

  // Sync the mode with the current page
  const syncModeWithPage = useCallback(() => {
    const pathMode = pathToMode(location.pathname);
    if (currentMode !== pathMode) {
      setMode(pathMode);
    }
  }, [currentMode, location.pathname, pathToMode, setMode]);

  // Get a user-friendly label for the mode
  const getModeLabel = useCallback((mode: ChatMode): string => {
    return CHAT_MODE_DISPLAY_NAMES[mode] || mode;
  }, []);

  // Get a description for the mode
  const getModeDescription = useCallback((mode: ChatMode): string => {
    return CHAT_MODE_DESCRIPTIONS[mode] || '';
  }, []);

  return {
    currentMode,
    changeMode,
    syncPageWithMode,
    syncModeWithPage,
    getModeLabel,
    getModeDescription,
    pathToMode,
    modeToPath
  };
};
