import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { memo, useCallback } from "react";
import { cn } from "@/lib/utils";
import { Card } from "@/components/ui/card";
import { Check, Clock, AlertCircle } from "lucide-react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
// Use memo to prevent unnecessary re-renders
const Message = memo(function Message({ content, role, status = 'sent', id, timestamp, onRetry }) {
    // Map role to appropriate CSS classes
    const messageClass = role === 'user'
        ? 'chat-message-user'
        : role === 'system'
            ? 'chat-message-system'
            : 'chat-message-assistant';
    // Map status to icon and tooltip text
    const statusConfig = {
        pending: { icon: _jsx(Clock, { className: "h-3 w-3 animate-pulse" }), tooltip: 'Sending message...' },
        sent: { icon: _jsx(Check, { className: "h-3 w-3" }), tooltip: 'Message sent' },
        failed: { icon: _jsx(AlertCircle, { className: "h-3 w-3 text-destructive" }), tooltip: 'Failed to send' }
    };
    const { icon, tooltip } = statusConfig[status];
    // Add proper ARIA attributes for accessibility
    const messageType = role === 'user' ? 'Sent' : 'Received';
    const statusText = status === 'pending' ? 'Sending...' :
        status === 'sent' ? 'Sent' : 'Failed to send';
    // Handle retry click with memoization to prevent rerenders
    const handleRetryClick = useCallback(() => {
        if (status === 'failed' && id && onRetry) {
            onRetry(id);
        }
    }, [id, status, onRetry]);
    return (_jsx("div", { className: cn("chat-message flex w-full mb-4", role === "user" ? "chat-message-direction-end" : "chat-message-direction-start"), role: "listitem", "aria-label": `${messageType} message: ${content}`, "data-message-id": id, "data-message-role": role, "data-message-status": status, children: _jsx(Card, { className: cn("chat-message-bubble", messageClass, status === 'failed' && "chat-message-failed"), onClick: status === 'failed' ? handleRetryClick : undefined, tabIndex: status === 'failed' ? 0 : undefined, role: status === 'failed' ? 'button' : undefined, "aria-label": status === 'failed' ? 'Retry sending message' : undefined, onKeyDown: status === 'failed' ? (e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                    handleRetryClick();
                }
            } : undefined, children: _jsxs("div", { className: "chat-message-content flex items-start gap-2", children: [_jsx("p", { className: "chat-message-text", children: content }), _jsx(TooltipProvider, { children: _jsxs(Tooltip, { children: [_jsx(TooltipTrigger, { asChild: true, children: _jsx("span", { className: "chat-message-status ml-2 flex h-4 w-4 items-center justify-center self-end", "aria-label": statusText, children: icon }) }), _jsxs(TooltipContent, { side: "top", className: "chat-tooltip-content text-xs", children: [_jsx("p", { children: tooltip }), timestamp && (_jsx("p", { className: "chat-message-timestamp", children: new Date(timestamp).toLocaleTimeString() })), status === 'failed' && (_jsx("p", { className: "chat-message-retry text-xs text-destructive mt-1", children: "Click to retry" }))] })] }) })] }) }) }));
});
export { Message };
