
import React, { createContext, useContext, ReactNode, useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { ChatMode as SupabaseChatMode } from '@/integrations/supabase/types/enums';
import { ChatMode as StoreChatMode } from '../store/types/chat-store-types';
import { useChatStore } from '../store';
import { logger } from '@/services/chat/LoggingService';
import { supabaseModeToStoreMode, storeModeToSupabaseMode } from '@/utils/modeConversion';

interface ChatModeContextType {
  mode: SupabaseChatMode;
  setMode: (mode: SupabaseChatMode, navigateToPage?: boolean) => void;
  isEditorPage: boolean;
}

const ChatModeContext = createContext<ChatModeContextType | undefined>(undefined);

interface ChatModeProviderProps {
  children: ReactNode;
  isEditorPage?: boolean;
}

export function ChatModeProvider({ children, isEditorPage = false }: ChatModeProviderProps) {
  const { currentMode, setCurrentMode } = useChatStore();
  const location = useLocation();
  const navigate = useNavigate();
  
  const [mode, setModeState] = useState<SupabaseChatMode>(
    storeModeToSupabaseMode(currentMode as StoreChatMode)
  );

  // Detect route changes and update mode accordingly
  useEffect(() => {
    const pathname = location.pathname;
    let detectedMode: SupabaseChatMode = 'chat';
    
    if (pathname.includes('/editor')) {
      detectedMode = 'dev';
    } else if (pathname.includes('/gallery')) {
      detectedMode = 'image';
    } else if (pathname.includes('/training')) {
      detectedMode = 'training';
    }
    
    // Only update if the mode changed to avoid loops
    if (detectedMode !== mode) {
      logger.info(`Route changed to ${pathname}, setting mode to ${detectedMode}`);
      setModeState(detectedMode);
      const storeMode = supabaseModeToStoreMode(detectedMode);
      setCurrentMode(storeMode);
    }
  }, [location.pathname, setCurrentMode]);

  // When store's mode changes, update our local state
  useEffect(() => {
    const supabaseMode = storeModeToSupabaseMode(currentMode as StoreChatMode);
    if (supabaseMode !== mode) {
      setModeState(supabaseMode);
    }
  }, [currentMode, mode]);

  // Enhanced setMode that can also navigate to the correct page
  const setMode = (newMode: SupabaseChatMode, navigateToPage = false) => {
    logger.info(`Changing chat mode from ${mode} to ${newMode}${navigateToPage ? ' with navigation' : ''}`);
    setModeState(newMode);
    
    // Convert to store mode before updating the store
    const storeMode = supabaseModeToStoreMode(newMode);
    setCurrentMode(storeMode);
    
    // Navigate to the appropriate page if requested
    if (navigateToPage) {
      switch (newMode) {
        case 'dev':
        case 'developer':
          navigate('/editor');
          break;
        case 'image':
          navigate('/gallery');
          break;
        case 'training':
          navigate('/training');
          break;
        // chat mode doesn't need navigation - it works on any page
      }
    }
  };

  return (
    <ChatModeContext.Provider value={{ 
      mode, 
      setMode, 
      isEditorPage: location.pathname === '/editor' 
    }}>
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
