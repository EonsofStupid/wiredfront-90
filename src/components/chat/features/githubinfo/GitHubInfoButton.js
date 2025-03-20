import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from 'react';
import { Dialog, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { GitBranchIcon } from 'lucide-react';
import { HoverCard, HoverCardTrigger, HoverCardContent } from '@/components/ui/hover-card';
import { GitHubInfoDialog } from './GitHubInfoDialog';
import { logger } from '@/services/chat/LoggingService';
export function GitHubInfoButton() {
    const [isOpen, setIsOpen] = useState(false);
    const handleOpenChange = (open) => {
        setIsOpen(open);
        logger.info('GitHub info dialog state changed', { open });
    };
    const getPreviewContent = () => {
        return (_jsxs("div", { className: "space-y-2", children: [_jsxs("h4", { className: "text-sm font-medium flex items-center gap-1", children: [_jsx(GitBranchIcon, { className: "h-3.5 w-3.5" }), "GitHub Status"] }), _jsxs("div", { className: "space-y-2", children: [_jsxs("div", { className: "flex items-center justify-between", children: [_jsx("span", { className: "text-xs text-muted-foreground", children: "Last commit" }), _jsx("span", { className: "text-xs font-medium", children: "15 minutes ago" })] }), _jsxs("div", { className: "flex items-center justify-between", children: [_jsx("span", { className: "text-xs text-muted-foreground", children: "Status" }), _jsxs("div", { className: "flex items-center gap-1", children: [_jsx("span", { className: "h-3 w-3 rounded-full bg-green-500" }), _jsx("span", { className: "text-xs", children: "Synced" })] })] })] })] }));
    };
    return (_jsxs(Dialog, { onOpenChange: handleOpenChange, open: isOpen, children: [_jsxs(HoverCard, { openDelay: 300, closeDelay: 200, children: [_jsx(HoverCardTrigger, { asChild: true, children: _jsx(DialogTrigger, { asChild: true, children: _jsx(Button, { variant: "outline", size: "sm", className: "text-chat-knowledge-text border-chat-knowledge-border hover:bg-chat-knowledge-background/10", "aria-label": "GitHub integration status", children: _jsx(GitBranchIcon, { className: "h-4 w-4" }) }) }) }), _jsx(HoverCardContent, { className: "w-64 p-3 chat-dialog-content", side: "top", align: "end", children: getPreviewContent() })] }), isOpen && _jsx(GitHubInfoDialog, {})] }));
}
export default GitHubInfoButton;
