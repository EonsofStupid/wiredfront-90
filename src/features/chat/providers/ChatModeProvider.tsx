
import { validateChatMode } from '@/utils/validation/chatTypes';
import { createContext, ReactNode, useContext, useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { logger } from '../services/LoggingService';
import { useChatStore } from '../store/chatStore';
import { ChatMode, isChatMode } from '@/types/chat/core';

interface ChatModeContextType {
  currentMode: ChatMode;
  setMode: (mode: ChatMode) => void;
  isModeSupported: (mode: unknown) => boolean;
  isEditorMode: boolean;
  isProjectMode: boolean;
  isChatMode: boolean;
}

const ChatModeContext = createContext<ChatModeContextType | undefined>(undefined);

interface ChatModeProviderProps {
  children: ReactNode;
  isEditorPage: boolean;
}

export function ChatModeProvider({ children, isEditorPage }: ChatModeProviderProps) {
  const [currentMode, setCurrentMode] = useState<ChatMode>('chat');
  const { setCurrentMode: setStoreMode } = useChatStore();
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    // Auto-set mode based on page context
    if (isEditorPage) {
      const newMode: ChatMode = 'editor';
      setCurrentMode(newMode);
      setStoreMode(newMode);
    }
  }, [isEditorPage, setStoreMode]);

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
      }
    }
  }, [location.state?.mode, setStoreMode, currentMode]);

  const setMode = (mode: ChatMode) => {
    if (isModeSupported(mode)) {
      setCurrentMode(mode);
      setStoreMode(mode);
      
      // Update the location state
      navigate(location.pathname, { 
        state: { ...location.state, mode } 
      });
      
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
      isEditorMode: currentMode === 'editor',
      isProjectMode: currentMode === 'project',
      isChatMode: currentMode === 'chat'
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
