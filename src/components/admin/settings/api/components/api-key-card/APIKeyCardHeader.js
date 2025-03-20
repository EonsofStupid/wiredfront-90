import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, AlertCircle, Star, Shield, CalendarDays } from "lucide-react";
import { useAPIKeyCardActions } from "./hooks/useAPIKeyCardActions";
import { useRoleStore } from "@/stores/role";
import { format } from "date-fns";
import { TooltipProvider, TooltipContent, TooltipTrigger, Tooltip } from "@/components/ui/tooltip";
import { KeyBadge } from "./KeyBadge";
import { KeyActions } from "./KeyActions";
export function APIKeyCardHeader({ config, onValidate, onDelete, onRefresh }) {
    const { handleToggleEnabled, handleSetDefault, updatingStatus } = useAPIKeyCardActions({
        config,
        onRefresh
    });
    const { hasRole } = useRoleStore();
    const isSuperAdmin = hasRole('super_admin');
    const isAdmin = hasRole('admin');
    return (_jsx(CardHeader, { className: "pb-3 border-b border-gray-800", children: _jsxs("div", { className: "flex justify-between items-start", children: [_jsx("div", { children: _jsxs("div", { className: "flex items-center", children: [_jsxs(CardTitle, { className: "flex items-center text-xl", children: [_jsx(KeyBadge, { type: config.api_type }), _jsxs("div", { className: "ml-3 flex space-x-2", children: [getValidityBadge(config.validation_status), config.is_default && (_jsxs(Badge, { className: "bg-blue-500/20 text-blue-300 hover:bg-blue-500/30 border-blue-500/30", children: [_jsx(Star, { className: "h-3 w-3 mr-1" }), " Default"] })), config.created_at && (_jsx(TooltipProvider, { children: _jsxs(Tooltip, { children: [_jsx(TooltipTrigger, { asChild: true, children: _jsxs(Badge, { variant: "outline", className: "cursor-help", children: [_jsx(CalendarDays, { className: "h-3 w-3 mr-1" }), format(new Date(config.created_at), 'MMM d, yyyy')] }) }), _jsx(TooltipContent, { children: _jsxs("p", { children: ["Created on ", format(new Date(config.created_at), 'MMMM d, yyyy')] }) })] }) }))] })] }), _jsxs(CardDescription, { className: "mt-1 text-gray-400", children: [config.memorable_name, config.last_validated && (_jsxs("span", { className: "ml-2 text-xs text-gray-500", children: ["\u2022 Last validated: ", format(new Date(config.last_validated), 'MMM d, yyyy')] }))] })] }) }), _jsx(KeyActions, { config: config, isSuperAdmin: isSuperAdmin, isAdmin: isAdmin, onValidate: onValidate, onDelete: onDelete, updatingStatus: updatingStatus, handleToggleEnabled: handleToggleEnabled, handleSetDefault: handleSetDefault })] }) }));
}
function getValidityBadge(status) {
    if (status === 'valid') {
        return (_jsxs(Badge, { className: "bg-green-500/20 text-green-300 hover:bg-green-500/30 border-green-500/30", children: [_jsx(CheckCircle, { className: "h-3 w-3 mr-1" }), " Valid"] }));
    }
    else if (status === 'invalid') {
        return (_jsxs(Badge, { className: "bg-red-500/20 text-red-300 hover:bg-red-500/30 border-red-500/30", children: [_jsx(AlertCircle, { className: "h-3 w-3 mr-1" }), " Invalid"] }));
    }
    else if (status === 'pending') {
        return (_jsxs(Badge, { className: "bg-amber-500/20 text-amber-300 hover:bg-amber-500/30 border-amber-500/30", children: [_jsx(Shield, { className: "h-3 w-3 mr-1" }), " Pending"] }));
    }
    else {
        return (_jsx(Badge, { variant: "outline", children: status || 'Unknown' }));
    }
}
