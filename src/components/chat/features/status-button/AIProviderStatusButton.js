import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Zap, Server, AlertTriangle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { HoverCard, HoverCardContent, HoverCardTrigger } from '@/components/ui/hover-card';
import { useChatStore } from '../../store/chatStore';
import { logger } from '@/services/chat/LoggingService';
export function AIProviderStatusButton() {
    const { currentProvider } = useChatStore();
    // Get status info
    const getStatus = () => {
        if (!currentProvider) {
            return {
                text: 'Not Connected',
                color: 'text-yellow-500',
                icon: AlertTriangle,
                description: 'No AI provider connected'
            };
        }
        return {
            text: 'Connected',
            color: 'text-green-500',
            icon: Zap,
            description: `Using ${currentProvider.name}`
        };
    };
    const status = getStatus();
    const Icon = status.icon;
    const handleClick = () => {
        logger.info('AI Provider status clicked');
    };
    return (_jsxs(HoverCard, { openDelay: 300, closeDelay: 200, children: [_jsx(HoverCardTrigger, { asChild: true, children: _jsx(Button, { variant: "outline", size: "sm", onClick: handleClick, className: `border-chat-knowledge-border hover:bg-chat-knowledge-background/10 ${status.color}`, children: _jsx(Icon, { className: "h-4 w-4" }) }) }), _jsx(HoverCardContent, { align: "end", className: "w-80 chat-dialog-content", children: _jsxs("div", { className: "space-y-2", children: [_jsxs("h4", { className: "text-sm font-medium flex items-center gap-1", children: [_jsx(Server, { className: "h-3.5 w-3.5" }), "AI Provider Status"] }), _jsxs("div", { className: "space-y-2", children: [_jsxs("div", { className: "flex items-center justify-between", children: [_jsx("span", { className: "text-xs text-muted-foreground", children: "Status" }), _jsxs("span", { className: `text-xs font-medium flex items-center gap-1 ${status.color}`, children: [_jsx(Icon, { className: "h-3 w-3" }), _jsx("span", { children: status.text })] })] }), _jsxs("div", { className: "flex items-center justify-between", children: [_jsx("span", { className: "text-xs text-muted-foreground", children: "Provider" }), _jsx("span", { className: "text-xs font-medium", children: currentProvider?.name || 'None' })] }), _jsxs("div", { className: "flex items-center justify-between", children: [_jsx("span", { className: "text-xs text-muted-foreground", children: "Model" }), _jsx("span", { className: "text-xs font-medium", children: currentProvider?.models?.[0] || 'Not specified' })] }), _jsx("div", { className: "text-xs text-muted-foreground mt-2", children: status.description })] })] }) })] }));
}
