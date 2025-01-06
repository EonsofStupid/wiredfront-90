import React from 'react';
import { LivePreview } from '@/components/editor/LivePreview';
import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from '@/components/ui/resizable';
import { useEditorMode } from '@/features/chat/core/providers/EditorModeProvider';

const Editor = () => {
  const { currentFiles, activeFile } = useEditorMode();

  return (
    <div className="h-[calc(100vh-4rem)] w-full">
      <ResizablePanelGroup direction="horizontal">
        <ResizablePanel defaultSize={50} minSize={30}>
          <div className="h-full p-4">
            {/* Your existing editor content */}
            <h1 className="text-2xl font-bold mb-4">Editor</h1>
          </div>
        </ResizablePanel>
        <ResizableHandle />
        <ResizablePanel defaultSize={50} minSize={30}>
          <LivePreview files={currentFiles} activeFile={activeFile} />
        </ResizablePanel>
      </ResizablePanelGroup>
    </div>
  );
};

export default Editor;