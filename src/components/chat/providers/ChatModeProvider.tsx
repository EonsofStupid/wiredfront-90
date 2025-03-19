import React, { createContext, useContext, ReactNode, useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useChatStore } from '../store';
import { logger } from '@/services/chat/LoggingService';
import { supabaseModeToStoreMode, storeModeToSupabaseMode } from '@/utils/modeConversion';
import { ChatMode } from '@/types/chat';

interface ChatModeContextType {
  currentMode: ChatMode;
  setMode: (mode: ChatMode) => void;
  isModeSupported: (mode: ChatMode) => boolean;
}

const ChatModeContext = createContext<ChatModeContextType | undefined>(undefined);

export function ChatModeProvider({ children }: { children: ReactNode }) {
  const [currentMode, setCurrentMode] = useState<ChatMode>('chat');
  const { setCurrentMode: setStoreMode } = useChatStore();
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const mode = location.state?.mode as ChatMode;
    if (mode && isModeSupported(mode)) {
      setCurrentMode(mode);
      setStoreMode(mode);
    }
  }, [location.state?.mode, setStoreMode]);

  const setMode = (mode: ChatMode) => {
    if (isModeSupported(mode)) {
      setCurrentMode(mode);
      setStoreMode(mode);
      navigate(location.pathname, { state: { mode } });
    }
  };

  const isModeSupported = (mode: ChatMode): boolean => {
    // Add your mode support logic here
    return true;
  };

  return (
    <ChatModeContext.Provider value={{ currentMode, setMode, isModeSupported }}>
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
