import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Badge } from "@/components/ui/badge";
import { MessageCircle } from "lucide-react";
export const SessionHeader = ({ sessionCount }) => {
    return (_jsxs("div", { className: "p-4 border-b border-white/10 bg-chat-header-bg flex justify-between items-center", children: [_jsxs("div", { className: "flex items-center gap-2", children: [_jsx(MessageCircle, { className: "h-4 w-4 text-chat-knowledge-text" }), _jsx("h2", { className: "font-semibold text-chat-text", children: "Chat Sessions" })] }), _jsxs(Badge, { variant: "outline", className: "text-xs text-chat-knowledge-text border-chat-knowledge-border", children: [sessionCount, " ", sessionCount === 1 ? 'session' : 'sessions'] })] }));
};
