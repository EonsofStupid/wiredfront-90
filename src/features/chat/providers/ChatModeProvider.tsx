import { ChatMode, isChatMode } from '@/types/chat/core';
import { validateChatMode } from '@/utils/validation/chatTypes';
import { createContext, ReactNode, useContext, useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { logger } from '../services/LoggingService';
import { useChatStore } from '../store/chatStore';

interface ChatModeContextType {
  currentMode: ChatMode;
  setMode: (mode: ChatMode) => void;
  isModeSupported: (mode: unknown) => boolean;
  isEditorMode: boolean;
  isChatMode: boolean;
  isImageMode: boolean;
  isTrainingMode: boolean;
}

const ChatModeContext = createContext<ChatModeContextType | undefined>(undefined);

interface ChatModeProviderProps {
  children: ReactNode;
  isEditorPage?: boolean;
  isGalleryPage?: boolean;
  isTrainingPage?: boolean;
}

export function ChatModeProvider({
  children,
  isEditorPage,
  isGalleryPage,
  isTrainingPage
}: ChatModeProviderProps) {
  const [currentMode, setCurrentMode] = useState<ChatMode>('chat');
  const { setCurrentMode: setStoreMode } = useChatStore();
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    // Auto-set mode based on page context
    if (isEditorPage) {
      const newMode: ChatMode = 'dev';
      setCurrentMode(newMode);
      setStoreMode(newMode);
    } else if (isGalleryPage) {
      const newMode: ChatMode = 'image';
      setCurrentMode(newMode);
      setStoreMode(newMode);
    } else if (isTrainingPage) {
      const newMode: ChatMode = 'training';
      setCurrentMode(newMode);
      setStoreMode(newMode);
    }
  }, [isEditorPage, isGalleryPage, isTrainingPage, setStoreMode]);

  useEffect(() => {
    // Get mode from location state if available
    const locationMode = location.state?.mode;

    if (locationMode) {
      // Validate and normalize the mode
      const validMode = validateChatMode(locationMode, { silent: true });

      if (validMode !== currentMode) {
        setCurrentMode(validMode);
        setStoreMode(validMode);
        logger.info('Mode set from location state', { mode: validMode });

        // Handle page navigation based on mode
        switch (validMode) {
          case 'dev':
            if (!isEditorPage) navigate('/editor');
            break;
          case 'image':
            if (!isGalleryPage) navigate('/gallery');
            break;
          case 'training':
            if (!isTrainingPage) navigate('/training');
            break;
        }
      }
    }
  }, [location.state?.mode, setStoreMode, currentMode, navigate, isEditorPage, isGalleryPage, isTrainingPage]);

  const setMode = (mode: ChatMode) => {
    if (isModeSupported(mode)) {
      setCurrentMode(mode);
      setStoreMode(mode);

      // Update the location state and handle navigation
      switch (mode) {
        case 'dev':
          if (!isEditorPage) navigate('/editor', { state: { mode } });
          break;
        case 'image':
          if (!isGalleryPage) navigate('/gallery', { state: { mode } });
          break;
        case 'training':
          if (!isTrainingPage) navigate('/training', { state: { mode } });
          break;
        default:
          navigate(location.pathname, { state: { ...location.state, mode } });
      }

      logger.info('Mode updated', { mode });
    } else {
      logger.warn('Unsupported mode', { mode });
    }
  };

  const isModeSupported = (mode: unknown): boolean => {
    return isChatMode(mode);
  };

  return (
    <ChatModeContext.Provider value={{
      currentMode,
      setMode,
      isModeSupported,
      isEditorMode: currentMode === 'dev',
      isChatMode: currentMode === 'chat',
      isImageMode: currentMode === 'image',
      isTrainingMode: currentMode === 'training'
    }}>
      {children}
    </ChatModeContext.Provider>
  );
}

export const useChatMode = () => {
  const context = useContext(ChatModeContext);
  if (context === undefined) {
    throw new Error('useChatMode must be used within a ChatModeProvider');
  }
  return context;
};
