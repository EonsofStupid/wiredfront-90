
import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { ChatMode, CHAT_MODES } from './types';
import { useChatBridge } from '../ChatBridge/useChatBridge';

interface ModeContextType {
  currentMode: ChatMode;
  setMode: (mode: ChatMode) => void;
  isEditorPage: boolean;
  isGalleryPage: boolean;
  isTrainingPage: boolean;
}

const ModeContext = createContext<ModeContextType | undefined>(undefined);

export const useMode = () => {
  const context = useContext(ModeContext);
  if (context === undefined) {
    throw new Error('useMode must be used within a ModeProvider');
  }
  return context;
};

interface ModeProviderProps {
  children: ReactNode;
}

export const ModeProvider: React.FC<ModeProviderProps> = ({ children }) => {
  const [currentMode, setCurrentMode] = useState<ChatMode>('standard');
  const location = useLocation();
  const chatBridge = useChatBridge();
  
  // Determine current page type
  const isEditorPage = location.pathname === '/editor';
  const isGalleryPage = location.pathname === '/gallery';
  const isTrainingPage = location.pathname === '/training';
  
  // Automatically switch mode based on current page
  useEffect(() => {
    if (isEditorPage) {
      setCurrentMode('developer');
    } else if (isGalleryPage) {
      setCurrentMode('image');
    } else if (isTrainingPage) {
      setCurrentMode('training');
    } else {
      setCurrentMode('standard');
    }
  }, [isEditorPage, isGalleryPage, isTrainingPage]);
  
  // Notify chat bridge of mode changes
  useEffect(() => {
    chatBridge.sendEvent('modeChanged', { 
      mode: currentMode,
      modeConfig: CHAT_MODES[currentMode] 
    });
  }, [currentMode, chatBridge]);
  
  const setMode = (mode: ChatMode) => {
    setCurrentMode(mode);
  };
  
  return (
    <ModeContext.Provider value={{ 
      currentMode, 
      setMode, 
      isEditorPage, 
      isGalleryPage, 
      isTrainingPage 
    }}>
      {children}
    </ModeContext.Provider>
  );
};
