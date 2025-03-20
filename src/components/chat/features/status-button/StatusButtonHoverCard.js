import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { HoverCard, HoverCardContent, HoverCardTrigger } from "@/components/ui/hover-card";
import { StatusButtonPreview } from './StatusButtonPreview';
import { Button } from '@/components/ui/button';
import { logger } from '@/services/chat/LoggingService';
export const StatusButtonHoverCard = ({ type, icon: Icon, onClick, disabled = false, showBadge = false, badgeCount = 0, className = '', }) => {
    // Log any hover events for analytics
    const handleHoverStart = () => {
        logger.info(`StatusButton hover started`, { type });
    };
    const handleHoverEnd = () => {
        logger.info(`StatusButton hover ended`, { type });
    };
    const handleClick = (e) => {
        // Prevent event propagation
        e.stopPropagation();
        logger.info(`StatusButton clicked`, { type });
        onClick();
    };
    return (_jsxs(HoverCard, { openDelay: 300, closeDelay: 200, children: [_jsx(HoverCardTrigger, { asChild: true, onMouseEnter: handleHoverStart, onMouseLeave: handleHoverEnd, children: _jsxs(Button, { variant: "ghost", size: "sm", onClick: handleClick, disabled: disabled, className: `relative ${className}`, "aria-label": `Open ${type} status dialog`, children: [_jsx(Icon, { className: "h-5 w-5" }), showBadge && badgeCount > 0 && (_jsx("span", { className: "absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-destructive text-[10px] text-destructive-foreground", children: badgeCount > 9 ? '9+' : badgeCount })), _jsx("span", { className: "sr-only", children: type === 'github' ? 'GitHub Status' : 'Notifications' })] }) }), _jsx(HoverCardContent, { align: "end", className: "w-80", children: _jsx(StatusButtonPreview, { type: type }) })] }));
};
