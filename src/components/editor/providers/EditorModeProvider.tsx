
import React, { createContext, useContext, ReactNode, useState } from 'react';

interface EditorModeContextType {
  currentFiles: Record<string, string>;
  activeFile: string | null;
  setFiles: (files: Record<string, string>) => void;
  setActiveFile: (file: string) => void;
}

const EditorModeContext = createContext<EditorModeContextType | undefined>(undefined);

export function EditorModeProvider({ children }: { children: ReactNode }) {
  const [currentFiles, setCurrentFiles] = useState<Record<string, string>>({});
  const [activeFile, setActiveFile] = useState<string | null>(null);

  const setFiles = (files: Record<string, string>) => {
    setCurrentFiles(files);
  };

  return (
    <EditorModeContext.Provider 
      value={{ 
        currentFiles, 
        activeFile, 
        setFiles, 
        setActiveFile 
      }}
    >
      {children}
    </EditorModeContext.Provider>
  );
}

export const useEditorMode = () => {
  const context = useContext(EditorModeContext);
  if (context === undefined) {
    throw new Error('useEditorMode must be used within an EditorModeProvider');
  }
  return context;
};
