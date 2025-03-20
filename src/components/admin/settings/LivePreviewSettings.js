import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Switch } from "@/components/ui/switch";
import { SettingsContainer } from "./layout/SettingsContainer";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Loader2, CheckCircle, AlertCircle } from "lucide-react";
import { useSettingsStore } from "@/stores/settings";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
const StatusIndicator = ({ status }) => {
    if (status === 'active') {
        return _jsx(CheckCircle, { className: "h-4 w-4 text-green-500" });
    }
    if (status === 'error') {
        return _jsx(AlertCircle, { className: "h-4 w-4 text-red-500" });
    }
    return _jsx(Loader2, { className: "h-4 w-4 animate-spin" });
};
const LogEntry = ({ type, message }) => {
    const iconMap = {
        success: _jsx(CheckCircle, { className: "h-4 w-4 text-green-500" }),
        info: _jsx(Loader2, { className: "h-4 w-4 text-blue-500" }),
        error: _jsx(AlertCircle, { className: "h-4 w-4 text-red-500" })
    };
    return (_jsxs("div", { className: "flex items-center gap-2 text-sm", children: [iconMap[type], _jsx("span", { children: message })] }));
};
export function LivePreviewSettings() {
    const { preferences, updatePreferences } = useSettingsStore();
    const livePreviewEnabled = preferences?.livePreview?.enabled || false;
    const handleToggleLivePreview = async (enabled) => {
        updatePreferences({
            livePreview: {
                ...preferences?.livePreview,
                enabled
            }
        });
        try {
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
            toast.success(`Live Preview ${enabled ? 'enabled' : 'disabled'}`);
        }
        catch (error) {
            console.error('Error updating live preview status:', error);
            updatePreferences({
                livePreview: {
                    ...preferences?.livePreview,
                    enabled: !enabled
                }
            });
            toast.error('Failed to update Live Preview status');
        }
    };
    return (_jsx(SettingsContainer, { title: "Live Preview", description: "Configure how code changes are previewed in real-time", children: _jsxs("div", { className: "space-y-6", children: [_jsxs("div", { className: "flex items-center justify-between", children: [_jsxs("div", { className: "space-y-0.5", children: [_jsx("h3", { className: "text-base font-medium", children: "Enable Live Preview" }), _jsx("p", { className: "text-sm text-muted-foreground", children: "See your code changes in real-time as they happen" })] }), _jsx(Switch, { checked: livePreviewEnabled, onCheckedChange: handleToggleLivePreview })] }), livePreviewEnabled && (_jsxs(Card, { className: "p-4 space-y-4", children: [_jsxs("div", { className: "flex items-center gap-2", children: [_jsx(StatusIndicator, { status: "active" }), _jsx("span", { className: "text-sm font-medium", children: "Preview Status" })] }), _jsx(Progress, { value: 100, className: "h-2" }), _jsx(ScrollArea, { className: "h-32 rounded-md border", children: _jsxs("div", { className: "p-4 space-y-2", children: [_jsx(LogEntry, { type: "success", message: "Live Preview initialized successfully" }), _jsx(LogEntry, { type: "info", message: "Watching for file changes..." })] }) })] }))] }) }));
}
