import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Card } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { useFeatureFlags } from '@/hooks/useFeatureFlags';
import { RotateCcw } from 'lucide-react';
import { toast } from 'sonner';
export const ChatProviderSettings = ({ title = 'Chat Provider Settings', description = 'Configure chat provider settings and features', }) => {
    const { features, toggleFeature, isUpdating } = useFeatureFlags();
    const handleReset = () => {
        // Reset all features to default
        if (!features.codeAssistant)
            toggleFeature('codeAssistant');
        if (!features.ragSupport)
            toggleFeature('ragSupport');
        if (!features.githubSync)
            toggleFeature('githubSync');
        if (!features.notifications)
            toggleFeature('notifications');
        toast.success("Chat features reset to defaults");
    };
    return (_jsx(Card, { className: "p-6", children: _jsxs("div", { className: "space-y-6", children: [_jsxs("div", { children: [_jsx("h2", { className: "text-lg font-semibold mb-4", children: title }), _jsx("p", { className: "text-muted-foreground mb-4", children: description })] }), _jsxs("div", { className: "space-y-4", children: [_jsx("h3", { className: "text-sm font-medium", children: "Features" }), _jsxs("div", { className: "flex items-center justify-between", children: [_jsxs("div", { className: "space-y-0.5", children: [_jsx(Label, { htmlFor: "codeAssistant", children: "Code Assistant" }), _jsx("p", { className: "text-sm text-muted-foreground", children: "Enable code assistance features" })] }), _jsx(Switch, { id: "codeAssistant", checked: features.codeAssistant, onCheckedChange: () => toggleFeature('codeAssistant'), disabled: isUpdating })] }), _jsxs("div", { className: "flex items-center justify-between", children: [_jsxs("div", { className: "space-y-0.5", children: [_jsx(Label, { htmlFor: "ragSupport", children: "RAG Support" }), _jsx("p", { className: "text-sm text-muted-foreground", children: "Enable retrieval augmented generation" })] }), _jsx(Switch, { id: "ragSupport", checked: features.ragSupport, onCheckedChange: () => toggleFeature('ragSupport'), disabled: isUpdating })] }), _jsxs("div", { className: "flex items-center justify-between", children: [_jsxs("div", { className: "space-y-0.5", children: [_jsx(Label, { htmlFor: "githubSync", children: "GitHub Sync" }), _jsx("p", { className: "text-sm text-muted-foreground", children: "Enable GitHub integration in editor mode" })] }), _jsx(Switch, { id: "githubSync", checked: features.githubSync, onCheckedChange: () => toggleFeature('githubSync'), disabled: isUpdating })] }), _jsxs("div", { className: "flex items-center justify-between", children: [_jsxs("div", { className: "space-y-0.5", children: [_jsx(Label, { htmlFor: "notifications", children: "Notifications" }), _jsx("p", { className: "text-sm text-muted-foreground", children: "Enable notification features" })] }), _jsx(Switch, { id: "notifications", checked: features.notifications, onCheckedChange: () => toggleFeature('notifications'), disabled: isUpdating })] })] }), _jsxs(Button, { onClick: handleReset, variant: "outline", className: "w-full", disabled: isUpdating, children: [_jsx(RotateCcw, { className: "h-4 w-4 mr-2" }), "Reset to Defaults"] })] }) }));
};
