import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { Helmet } from "react-helmet";
import { NavigationLogsPanel } from "@/components/admin/logging/NavigationLogsPanel";
import { Route } from "lucide-react";
export default function NavigationLogsPage() {
    return (_jsxs(_Fragment, { children: [_jsx(Helmet, { children: _jsx("title", { children: "Navigation Logs | Admin Dashboard" }) }), _jsxs("div", { className: "space-y-6 p-6", children: [_jsx("div", { className: "flex items-center justify-between", children: _jsxs("div", { children: [_jsxs("h1", { className: "text-2xl font-semibold flex items-center gap-2", children: [_jsx(Route, { className: "h-6 w-6" }), "Navigation Logs"] }), _jsx("p", { className: "text-muted-foreground", children: "Track user navigation across the platform for analytics and debugging" })] }) }), _jsx("div", { className: "grid grid-cols-1 gap-6", children: _jsx(NavigationLogsPanel, {}) })] })] }));
}
