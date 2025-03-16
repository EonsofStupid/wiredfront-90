
import React, { createContext, useContext, ReactNode, useState, useEffect } from 'react';
import { ChatMode } from '@/integrations/supabase/types/enums';
import { useChatStore } from '../store/chatStore';

interface ChatModeContextType {
  mode: ChatMode;
  setMode: (mode: ChatMode) => void;
  isEditorPage: boolean;
}

interface ChatModeProviderProps {
  children: ReactNode;
  isEditorPage: boolean;
}

const ChatModeContext = createContext<ChatModeContextType | undefined>(undefined);

export const ChatModeProvider: React.FC<ChatModeProviderProps> = ({ 
  children, isEditorPage 
}) => {
  const [mode, setMode] = useState<ChatMode>('chat');
  const { setCurrentMode } = useChatStore();
  
  // Update global state when mode changes
  useEffect(() => {
    setCurrentMode(mode);
  }, [mode, setCurrentMode]);
  
  return (
    <ChatModeContext.Provider value={{ mode, setMode, isEditorPage }}>
      {children}
    </ChatModeContext.Provider>
  );
};

export const useChatMode = () => {
  const context = useContext(ChatModeContext);
  if (!context) {
    throw new Error('useChatMode must be used within a ChatModeProvider');
  }
  return context;
};
