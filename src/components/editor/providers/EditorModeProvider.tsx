
import React, { createContext, useContext, useState } from 'react';

interface EditorModeContextType {
  currentFiles: Record<string, string>;
  activeFile: string | null;
  setCurrentFiles: (files: Record<string, string>) => void;
  setActiveFile: (file: string | null) => void;
}

const EditorModeContext = createContext<EditorModeContextType | undefined>(undefined);

export function EditorModeProvider({ children }: { children: React.ReactNode }) {
  const [currentFiles, setCurrentFiles] = useState<Record<string, string>>({});
  const [activeFile, setActiveFile] = useState<string | null>(null);

  return (
    <EditorModeContext.Provider 
      value={{
        currentFiles,
        activeFile,
        setCurrentFiles,
        setActiveFile
      }}
    >
      {children}
    </EditorModeContext.Provider>
  );
}

export function useEditorMode() {
  const context = useContext(EditorModeContext);
  if (context === undefined) {
    throw new Error('useEditorMode must be used within an EditorModeProvider');
  }
  return context;
}
