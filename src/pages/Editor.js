import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import React from 'react';
import { LivePreview } from '@/components/editor/LivePreview';
import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from '@/components/ui/resizable';
import { useEditorMode } from '@/components/editor/providers/EditorModeProvider';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Progress } from '@/components/ui/progress';
import { ScrollArea } from '@/components/ui/scroll-area';
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
            if (error)
                throw error;
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
        }
        catch (error) {
            console.error('Error updating live preview status:', error);
            toast.error('Failed to update Live Preview status');
        }
    };
    return (_jsxs("div", { className: "h-[calc(100vh-4rem)] w-full", children: [_jsx("div", { className: "flex justify-end p-2 border-b", children: _jsx(Button, { variant: livePreviewEnabled ? "destructive" : "default", onClick: handleToggleLivePreview, children: livePreviewEnabled ? 'Stop Live Preview' : 'Start Live Preview' }) }), _jsxs(ResizablePanelGroup, { direction: "horizontal", children: [_jsx(ResizablePanel, { defaultSize: 50, minSize: 30, children: _jsx("div", { className: "h-full p-4", children: _jsx("h1", { className: "text-2xl font-bold mb-4", children: "Editor" }) }) }), _jsx(ResizableHandle, {}), _jsx(ResizablePanel, { defaultSize: 50, minSize: 30, children: livePreviewEnabled ? (_jsx(LivePreview, { files: currentFiles, activeFile: activeFile || 'src/App.tsx' })) : (_jsx("div", { className: "h-full flex items-center justify-center text-muted-foreground", children: "Live Preview is disabled" })) })] }), _jsx(Dialog, { open: showInitDialog, onOpenChange: setShowInitDialog, children: _jsxs(DialogContent, { children: [_jsx(DialogHeader, { children: _jsx(DialogTitle, { children: "Initializing Live Preview" }) }), _jsxs("div", { className: "space-y-4", children: [_jsx(Progress, { value: 100, className: "h-2" }), _jsx(ScrollArea, { className: "h-32 rounded-md border", children: _jsxs("div", { className: "p-4 space-y-2", children: [_jsx(LogEntry, { type: "success", message: "Live Preview initialized successfully" }), _jsx(LogEntry, { type: "info", message: "Watching for file changes..." })] }) })] })] }) })] }));
};
function LogEntry({ type, message }) {
    const colors = {
        info: 'text-blue-500',
        success: 'text-green-500',
        error: 'text-red-500',
        warning: 'text-yellow-500'
    };
    return (_jsxs("div", { className: "text-sm flex items-center gap-2", children: [_jsx("span", { className: colors[type], children: "\u25CF" }), _jsx("span", { children: message })] }));
}
export default Editor;
