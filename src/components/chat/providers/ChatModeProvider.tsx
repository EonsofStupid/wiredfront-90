
import React, { createContext, useContext, ReactNode, useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useChatStore } from '../store/chatStore';
import { logger } from '@/services/chat/LoggingService';
import { supabaseModeToStoreMode, storeModeToSupabaseMode } from '@/utils/modeConversion';
import { ChatMode } from '@/types/chat';

interface ChatModeContextType {
  currentMode: ChatMode;
  setMode: (mode: ChatMode) => void;
  isModeSupported: (mode: ChatMode) => boolean;
  isEditorPage: boolean;
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
    const mode = location.state?.mode as ChatMode;
    if (mode && isModeSupported(mode)) {
      setCurrentMode(mode);
      setStoreMode(supabaseModeToStoreMode(mode));
      
      logger.info('Mode set from location state', { mode });
    }
  }, [location.state?.mode, setStoreMode]);

  const setMode = (mode: ChatMode) => {
    if (isModeSupported(mode)) {
      setCurrentMode(mode);
      setStoreMode(supabaseModeToStoreMode(mode));
      navigate(location.pathname, { state: { mode } });
      
      logger.info('Mode updated', { mode });
    } else {
      logger.warn('Unsupported mode', { mode });
    }
  };

  const isModeSupported = (mode: ChatMode): boolean => {
    return ['chat', 'dev', 'image', 'training', 'code', 'planning'].includes(mode);
  };

  return (
    <ChatModeContext.Provider value={{ currentMode, setMode, isModeSupported, isEditorPage }}>
      {children}
    </ChatModeContext.Provider>
  );
}

export function useChatMode() {
  const context = useContext(ChatModeContext);
  if (context === undefined) {
    throw new Error('useChatMode must be used within a ChatModeProvider');
  }
  return context;
}
