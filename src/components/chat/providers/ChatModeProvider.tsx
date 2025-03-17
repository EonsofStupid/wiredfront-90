
import React, { createContext, useContext, ReactNode, useState, useEffect } from 'react';
import { ChatMode as SupabaseChatMode } from '@/integrations/supabase/types/enums';
import { ChatMode as StoreChatMode } from '../store/types/chat-store-types';
import { useChatStore } from '../store/chatStore';
import { logger } from '@/services/chat/LoggingService';
import { supabaseModeToStoreMode, storeModeToSupabaseMode } from '@/utils/modeConversion';

interface ChatModeContextType {
  mode: SupabaseChatMode;
  setMode: (mode: SupabaseChatMode) => void;
  isEditorPage: boolean;
}

const ChatModeContext = createContext<ChatModeContextType | undefined>(undefined);

interface ChatModeProviderProps {
  children: ReactNode;
  isEditorPage?: boolean;
}

export function ChatModeProvider({ children, isEditorPage = false }: ChatModeProviderProps) {
  const { currentMode, setCurrentMode } = useChatStore();
  const [mode, setModeState] = useState<SupabaseChatMode>(
    storeModeToSupabaseMode(currentMode as StoreChatMode)
  );

  useEffect(() => {
    // When the store's mode changes, update our local state
    setModeState(storeModeToSupabaseMode(currentMode as StoreChatMode));
  }, [currentMode]);

  // When local state changes, update the store
  const setMode = (newMode: SupabaseChatMode) => {
    logger.info(`Changing chat mode from ${mode} to ${newMode}`);
    setModeState(newMode);
    
    // Convert to store mode before updating the store
    const storeMode = supabaseModeToStoreMode(newMode);
    setCurrentMode(storeMode);
  };

  return (
    <ChatModeContext.Provider value={{ mode, setMode, isEditorPage }}>
      {children}
    </ChatModeContext.Provider>
  );
}

export const useChatMode = (): ChatModeContextType => {
  const context = useContext(ChatModeContext);
  if (context === undefined) {
    throw new Error('useChatMode must be used within a ChatModeProvider');
  }
  return context;
};
