import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { ArrowLeftRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useChatButtonStore } from '../store/chatButtonStore';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
export function ChatPositionToggle() {
    const { position, togglePosition } = useChatButtonStore();
    const positionText = position === 'bottom-right'
        ? 'Move to left'
        : 'Move to right';
    return (_jsx(TooltipProvider, { children: _jsxs(Tooltip, { children: [_jsx(TooltipTrigger, { asChild: true, children: _jsx(Button, { variant: "ghost", size: "icon", className: "chat-control-button h-8 w-8 hover:text-indigo-400 hover:bg-indigo-400/10", onClick: togglePosition, "aria-label": positionText, children: _jsx(ArrowLeftRight, { className: "h-4 w-4" }) }) }), _jsx(TooltipContent, { side: "bottom", children: _jsx("p", { children: positionText }) })] }) }));
}
