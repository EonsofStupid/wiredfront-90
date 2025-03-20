import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { FileText } from "lucide-react";
export function LogsEmptyState({ logsExist }) {
    return (_jsxs("div", { className: "py-8 text-center", children: [_jsx(FileText, { className: "h-12 w-12 text-muted-foreground mx-auto mb-4 opacity-50", "data-testid": "logs-empty-icon" }), _jsx("h3", { className: "text-lg font-medium mb-1", children: "No logs found" }), _jsx("p", { className: "text-sm text-muted-foreground", children: logsExist
                    ? "No logs match your current filters"
                    : "No system logs have been recorded yet" })] }));
}
