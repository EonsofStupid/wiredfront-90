import React, { createContext, useContext, useCallback } from 'react';
import { useLocation } from 'react-router-dom';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';

interface EditorModeContextValue {
  isEditorMode: boolean;
  generateCode: (prompt: string) => Promise<void>;
  modifyFile: (filePath: string, content: string) => Promise<void>;
  viewProject: () => Promise<void>;
}

const EditorModeContext = createContext<EditorModeContextValue | null>(null);

export const useEditorMode = () => {
  const context = useContext(EditorModeContext);
  if (!context) {
    throw new Error('useEditorMode must be used within an EditorModeProvider');
  }
  return context;
};

export const EditorModeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const location = useLocation();
  const isEditorMode = location.pathname === '/editor';

  const generateCode = useCallback(async (prompt: string) => {
    try {
      const { data, error } = await supabase.functions.invoke('generate-code', {
        body: { prompt }
      });

      if (error) throw error;

      // Open the generated code in a new window/iframe
      const previewUrl = `https://stackblitz.com/edit/react-ts-preview?file=src/${data.fileName}`;
      window.open(previewUrl, '_blank');

      toast.success('Code generated successfully');
    } catch (error) {
      console.error('Error generating code:', error);
      toast.error('Failed to generate code');
    }
  }, []);

  const modifyFile = useCallback(async (filePath: string, content: string) => {
    try {
      const { error } = await supabase.functions.invoke('modify-file', {
        body: { filePath, content }
      });

      if (error) throw error;
      toast.success('File modified successfully');
    } catch (error) {
      console.error('Error modifying file:', error);
      toast.error('Failed to modify file');
    }
  }, []);

  const viewProject = useCallback(async () => {
    try {
      const { data, error } = await supabase.functions.invoke('get-project', {
        body: {}
      });

      if (error) throw error;

      // Open project in StackBlitz
      const previewUrl = `https://stackblitz.com/edit/react-ts-preview?file=${data.entryFile}`;
      window.open(previewUrl, '_blank');
    } catch (error) {
      console.error('Error viewing project:', error);
      toast.error('Failed to view project');
    }
  }, []);

  const value = {
    isEditorMode,
    generateCode,
    modifyFile,
    viewProject
  };

  return (
    <EditorModeContext.Provider value={value}>
      {children}
    </EditorModeContext.Provider>
  );
};