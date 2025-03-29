
import React, { createContext, useState, useContext, ReactNode } from 'react';
import { ChatMode } from '@/components/chat/types/chat/enums';
import { ModeContextType, ModeConfig, CHAT_MODES } from './types';
import { EnumUtils } from '@/lib/enums';

// Create context
const ModeContext = createContext<ModeContextType | undefined>(undefined);

interface ModeProviderProps {
  children: ReactNode;
  isEditorPage?: boolean;
  initialMode?: ChatMode;
}

export function ModeProvider({
  children,
  isEditorPage = false,
  initialMode = ChatMode.Chat
}: ModeProviderProps) {
  const [currentMode, setCurrentMode] = useState<ChatMode>(initialMode);

  const setMode = (mode: ChatMode | string) => {
    if (typeof mode === 'string') {
      setCurrentMode(EnumUtils.stringToChatMode(mode));
    } else {
      setCurrentMode(mode);
    }
  };

  const value: ModeContextType = {
    currentMode,
    setMode,
    availableModes: CHAT_MODES,
    isEditorPage
  };

  return (
    <ModeContext.Provider value={value}>
      {children}
    </ModeContext.Provider>
  );
}

export function useMode(): ModeContextType {
  const context = useContext(ModeContext);
  if (context === undefined) {
    throw new Error('useMode must be used within a ModeProvider');
  }
  return context;
}
