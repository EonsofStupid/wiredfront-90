import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { FileText } from "lucide-react";
export function LogsHeader() {
    return (_jsxs(CardHeader, { children: [_jsxs(CardTitle, { className: "text-xl font-semibold flex items-center gap-2", children: [_jsx(FileText, { className: "h-5 w-5", "data-testid": "logs-header-icon" }), "System Logs"] }), _jsx(CardDescription, { children: "View and manage system logs from across the application" })] }));
}
