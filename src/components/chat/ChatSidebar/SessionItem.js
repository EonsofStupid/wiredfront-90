import { jsxs as _jsxs, jsx as _jsx } from "react/jsx-runtime";
import { Badge } from '@/components/ui/badge';
import { formatDistanceToNow } from 'date-fns';
import { MessageCircle } from 'lucide-react';
import { cn } from '@/lib/utils';
const SessionItem = ({ id, lastAccessed, isActive, onSelect, provider, messageCount }) => {
    const handleClick = () => {
        onSelect(id);
    };
    return (_jsx("div", { className: cn("flex items-start gap-3 p-3 rounded-md cursor-pointer transition-colors", isActive
            ? "bg-primary/10 hover:bg-primary/15 border-l-2 border-primary"
            : "hover:bg-muted/50 border-l-2 border-transparent"), onClick: handleClick, "data-active": isActive, "data-session-id": id, children: _jsxs("div", { className: "flex-1 min-w-0", children: [_jsxs("div", { className: "flex items-center justify-between", children: [_jsxs("div", { className: "font-medium text-sm truncate", children: ["Session ", id.substring(0, 8)] }), provider && (_jsx(Badge, { variant: "outline", className: "text-[10px] h-5", children: provider }))] }), _jsxs("div", { className: "mt-1 flex items-center justify-between text-muted-foreground text-xs", children: [_jsx("span", { children: formatDistanceToNow(lastAccessed, { addSuffix: true }) }), messageCount !== undefined && messageCount > 0 && (_jsxs("div", { className: "flex items-center gap-1", children: [_jsx(MessageCircle, { className: "h-3 w-3" }), _jsx("span", { children: messageCount })] }))] })] }) }));
};
export default SessionItem;
