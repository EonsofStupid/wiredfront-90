import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useTokenManagement } from '@/hooks/useTokenManagement';
import { withTokenErrorBoundary } from './TokenErrorBoundary';
import { TokenAuthGuard } from './TokenAuthGuard';
import { Badge } from '@/components/ui/badge';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { Coins, AlertCircle } from 'lucide-react';
const TokenBalanceDisplayComponent = ({ showLabel = true, compact = false, className = '' }) => {
    const { tokenBalance, isTokenEnforcementEnabled, enforcementMode, isLoading, error } = useTokenManagement();
    if (error) {
        return (_jsxs("div", { className: "flex items-center text-red-500", children: [_jsx(AlertCircle, { size: 16, className: "mr-1" }), _jsx("span", { className: "text-xs", children: "Token error" })] }));
    }
    if (isLoading) {
        return (_jsx("div", { className: `animate-pulse ${className}`, children: _jsx("div", { className: "h-5 w-16 bg-muted rounded" }) }));
    }
    // If tokens aren't being enforced, don't show the display
    if (!isTokenEnforcementEnabled && !compact) {
        return null;
    }
    return (_jsx(TokenAuthGuard, { fallback: compact ? _jsx("span", { className: "text-muted-foreground text-xs", children: "Sign in" }) : null, children: _jsx(TooltipProvider, { children: _jsxs(Tooltip, { children: [_jsx(TooltipTrigger, { asChild: true, children: _jsxs("div", { className: `flex items-center ${className}`, children: [_jsx(Coins, { size: compact ? 14 : 16, className: `mr-1 ${isTokenEnforcementEnabled ? 'text-amber-500' : 'text-muted-foreground'}` }), showLabel && !compact && (_jsx("span", { className: "text-sm mr-1.5", children: "Tokens:" })), _jsx(Badge, { variant: isTokenEnforcementEnabled ? "secondary" : "outline", className: compact ? "text-xs px-1.5 py-0" : "", children: tokenBalance }), isTokenEnforcementEnabled && !compact && (_jsx(Badge, { variant: "outline", className: "ml-2 text-xs", children: enforcementMode }))] }) }), _jsx(TooltipContent, { children: _jsxs("div", { className: "space-y-1", children: [_jsxs("p", { className: "font-medium text-sm", children: ["Token Balance: ", tokenBalance] }), isTokenEnforcementEnabled ? (_jsxs("p", { className: "text-xs text-muted-foreground", children: ["Enforcement: ", enforcementMode] })) : (_jsx("p", { className: "text-xs text-muted-foreground", children: "Token enforcement is disabled" }))] }) })] }) }) }));
};
// Wrap with error boundary
export const TokenBalanceDisplay = withTokenErrorBoundary(TokenBalanceDisplayComponent);
