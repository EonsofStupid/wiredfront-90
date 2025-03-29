
import React from 'react';
import { EditorModeProvider } from '@/components/editor/providers/EditorModeProvider';
import { Editor as EditorComponent } from '@/components/editor/Editor';

/**
 * Main Editor page
 * Wraps the Editor component with the necessary providers
 */
export default function Editor() {
  return (
    <EditorModeProvider>
      <EditorComponent />
    </EditorModeProvider>
  );
}
