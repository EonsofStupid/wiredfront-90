import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { AlertCircle } from "lucide-react";
export function LogsErrorState({ error }) {
    return (_jsxs("div", { className: "p-4 border border-red-300 bg-red-50/10 rounded-md flex items-start gap-3 text-red-500", children: [_jsx(AlertCircle, { className: "h-5 w-5 mt-0.5 flex-shrink-0", "data-testid": "logs-error-icon" }), _jsxs("div", { children: [_jsx("p", { className: "font-medium mb-1", children: "Error Loading Logs" }), _jsx("p", { className: "text-sm", children: error })] })] }));
}
