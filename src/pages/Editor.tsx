import React from 'react';
import { LivePreview } from '@/components/editor/LivePreview';
import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from '@/components/ui/resizable';
import { useEditorMode } from '@/features/chat/core/providers/EditorModeProvider';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Progress } from '@/components/ui/progress';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Loader2, CheckCircle, AlertCircle } from 'lucide-react';
import { useSettingsStore } from '@/stores/settings';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

const Editor = () => {
  const { currentFiles, activeFile } = useEditorMode();
  const [showInitDialog, setShowInitDialog] = React.useState(false);
  const { preferences, updatePreferences } = useSettingsStore();
  const livePreviewEnabled = preferences?.livePreview?.enabled || false;

  const handleToggleLivePreview = async () => {
    try {
      const enabled = !livePreviewEnabled;
      const { error } = await supabase
        .from('live_preview_status')
        .upsert({ 
          user_id: (await supabase.auth.getUser()).data.user?.id,
          status: enabled ? 'initializing' : 'inactive',
          current_step: enabled ? 'Starting initialization...' : null,
          logs: []
        });

      if (error) throw error;

      updatePreferences({ 
        livePreview: { 
          ...preferences?.livePreview,
          enabled 
        } 
      });

      if (enabled) {
        setShowInitDialog(true);
      }
      toast.success(`Live Preview ${enabled ? 'enabled' : 'disabled'}`);
    } catch (error) {
      console.error('Error updating live preview status:', error);
      toast.error('Failed to update Live Preview status');
    }
  };

  return (
    <div className="h-[calc(100vh-4rem)] w-full">
      <div className="flex justify-end p-2 border-b">
        <Button
          variant={livePreviewEnabled ? "destructive" : "default"}
          onClick={handleToggleLivePreview}
        >
          {livePreviewEnabled ? 'Stop Live Preview' : 'Start Live Preview'}
        </Button>
      </div>
      <ResizablePanelGroup direction="horizontal">
        <ResizablePanel defaultSize={50} minSize={30}>
          <div className="h-full p-4">
            {/* Your existing editor content */}
            <h1 className="text-2xl font-bold mb-4">Editor</h1>
          </div>
        </ResizablePanel>
        <ResizableHandle />
        <ResizablePanel defaultSize={50} minSize={30}>
          {livePreviewEnabled ? (
            <LivePreview files={currentFiles} activeFile={activeFile} />
          ) : (
            <div className="h-full flex items-center justify-center text-muted-foreground">
              Live Preview is disabled
            </div>
          )}
        </ResizablePanel>
      </ResizablePanelGroup>

      <Dialog open={showInitDialog} onOpenChange={setShowInitDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Initializing Live Preview</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <Progress value={100} className="h-2" />
            <ScrollArea className="h-32 rounded-md border">
              <div className="p-4 space-y-2">
                <LogEntry type="success" message="Live Preview initialized successfully" />
                <LogEntry type="info" message="Watching for file changes..." />
              </div>
            </ScrollArea>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

function LogEntry({ type, message }: { type: 'info' | 'success' | 'error' | 'warning', message: string }) {
  const colors = {
    info: 'text-blue-500',
    success: 'text-green-500',
    error: 'text-red-500',
    warning: 'text-yellow-500'
  };

  return (
    <div className="text-sm flex items-center gap-2">
      <span className={colors[type]}>●</span>
      <span>{message}</span>
    </div>
  );
}

export default Editor;