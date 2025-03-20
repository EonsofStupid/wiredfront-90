import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { Helmet } from "react-helmet";
import { SystemLogsPanel } from "@/components/admin/logging/SystemLogsPanel";
import { FileText } from "lucide-react";
export default function SystemLogsPage() {
    return (_jsxs(_Fragment, { children: [_jsx(Helmet, { children: _jsx("title", { children: "System Logs | Admin Dashboard" }) }), _jsxs("div", { className: "space-y-6 p-6", children: [_jsx("div", { className: "flex items-center justify-between", children: _jsxs("div", { children: [_jsxs("h1", { className: "text-2xl font-semibold flex items-center gap-2", children: [_jsx(FileText, { className: "h-6 w-6" }), "System Logs"] }), _jsx("p", { className: "text-muted-foreground", children: "Monitor and manage system-wide logs for debugging and auditing" })] }) }), _jsx("div", { className: "grid grid-cols-1 gap-6", children: _jsx(SystemLogsPanel, {}) })] })] }));
}
