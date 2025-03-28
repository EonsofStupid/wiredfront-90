
import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { ChatMode } from './types';

interface ModeContextType {
  currentMode: ChatMode;
  setMode: (mode: ChatMode) => void;
  isEditorPage: boolean;
  isGalleryPage: boolean;
  isTrainingPage: boolean;
}

const ModeContext = createContext<ModeContextType | undefined>(undefined);

export const useModeManager = () => {
  const context = useContext(ModeContext);
  if (context === undefined) {
    throw new Error('useModeManager must be used within a ModeProvider');
  }
  return context;
};

interface ModeProviderProps {
  children: ReactNode;
}

export const ModeProvider: React.FC<ModeProviderProps> = ({ children }) => {
  const [currentMode, setCurrentMode] = useState<ChatMode>('standard');
  const location = useLocation();

  // Determine the current page based on the route
  const isEditorPage = location.pathname.includes('/editor');
  const isGalleryPage = location.pathname.includes('/gallery');
  const isTrainingPage = location.pathname.includes('/training');

  // Update the mode based on the current page
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

  return (
    <ModeContext.Provider
      value={{
        currentMode,
        setMode: setCurrentMode,
        isEditorPage,
        isGalleryPage,
        isTrainingPage,
      }}
    >
      {children}
    </ModeContext.Provider>
  );
};
