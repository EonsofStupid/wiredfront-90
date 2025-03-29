
import React from 'react';
import { useEditorMode } from './providers/EditorModeProvider';

/**
 * Main editor component
 */
export function Editor() {
  const { currentFiles, activeFile, setCurrentFiles, setActiveFile } = useEditorMode();
  
  return (
    <div className="h-screen flex flex-col">
      <header className="border-b p-4">
        <h1 className="text-xl font-semibold">Editor</h1>
      </header>
      
      <div className="flex-1 flex">
        {/* File Explorer */}
        <div className="w-64 border-r p-4">
          <h2 className="font-medium mb-2">Files</h2>
          <div className="space-y-1">
            {Object.keys(currentFiles).map(file => (
              <div 
                key={file}
                className={`p-2 rounded cursor-pointer ${activeFile === file ? 'bg-blue-100' : 'hover:bg-gray-100'}`}
                onClick={() => setActiveFile(file)}
              >
                {file}
              </div>
            ))}
            {Object.keys(currentFiles).length === 0 && (
              <div className="text-gray-500 text-sm">No files open</div>
            )}
          </div>
        </div>
        
        {/* Editor Area */}
        <div className="flex-1 p-4">
          {activeFile ? (
            <div className="h-full flex flex-col">
              <div className="font-mono text-sm flex-1 border rounded p-4">
                {currentFiles[activeFile]}
              </div>
            </div>
          ) : (
            <div className="h-full flex items-center justify-center text-gray-500">
              Select a file to edit
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
