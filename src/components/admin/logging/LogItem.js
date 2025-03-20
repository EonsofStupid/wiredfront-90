import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Badge } from "@/components/ui/badge";
import { AlertCircle, Info, Bug, FileText, GitBranch } from "lucide-react";
import { format } from "date-fns";
export function LogItem({ log, isExpanded, onToggleExpand }) {
    const getLogIcon = (level) => {
        switch (level) {
            case 'info': return _jsx(Info, { className: "h-4 w-4 text-blue-500", "data-testid": "log-level-icon" });
            case 'error': return _jsx(AlertCircle, { className: "h-4 w-4 text-red-500", "data-testid": "log-level-icon" });
            case 'warn': return _jsx(AlertCircle, { className: "h-4 w-4 text-amber-500", "data-testid": "log-level-icon" });
            case 'debug': return _jsx(Bug, { className: "h-4 w-4 text-purple-500", "data-testid": "log-level-icon" });
            default: return _jsx(Info, { className: "h-4 w-4", "data-testid": "log-level-icon" });
        }
    };
    const getSourceIcon = (source) => {
        if (source.includes('github'))
            return _jsx(GitBranch, { className: "h-4 w-4", "data-testid": "log-source-icon" });
        return _jsx(FileText, { className: "h-4 w-4", "data-testid": "log-source-icon" });
    };
    const formatTimestamp = (timestamp) => {
        try {
            return format(new Date(timestamp), 'yyyy-MM-dd HH:mm:ss');
        }
        catch {
            return timestamp;
        }
    };
    const getLevelBadgeVariant = (level) => {
        switch (level) {
            case 'info': return 'default';
            case 'error': return 'destructive';
            case 'warn': return 'outline';
            case 'debug': return 'secondary';
            default: return 'default';
        }
    };
    return (_jsxs("tr", { className: `hover:bg-muted/50 ${isExpanded ? 'bg-muted/30' : ''}`, onClick: onToggleExpand, "data-testid": "log-item-row", children: [_jsx("td", { className: "px-4 py-2 text-xs whitespace-nowrap", children: formatTimestamp(log.timestamp) }), _jsx("td", { className: "px-4 py-2", children: _jsxs(Badge, { variant: getLevelBadgeVariant(log.level), className: "flex gap-1 items-center", children: [getLogIcon(log.level), _jsx("span", { className: "capitalize text-xs", children: log.level })] }) }), _jsx("td", { className: "px-4 py-2", children: _jsxs("div", { className: "flex items-center gap-1", children: [getSourceIcon(log.source), _jsx("span", { className: "text-xs", children: log.source })] }) }), _jsxs("td", { className: "px-4 py-2 text-xs", children: [_jsx("div", { className: "max-w-md truncate", children: log.message }), isExpanded && log.metadata && (_jsx("div", { className: "mt-2 p-2 bg-muted/50 rounded text-xs overflow-x-auto", "data-testid": "log-metadata", children: _jsx("pre", { className: "whitespace-pre-wrap", children: JSON.stringify(log.metadata, null, 2) }) }))] })] }));
}
