import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Database } from "lucide-react";
export function DatabaseSettings() {
    return (_jsxs(Card, { children: [_jsxs(CardHeader, { children: [_jsxs(CardTitle, { className: "flex items-center gap-2", children: [_jsx(Database, { className: "h-5 w-5" }), "Database Connections"] }), _jsx(CardDescription, { children: "Manage database connection strings for development" })] }), _jsx(CardContent, { children: _jsxs("div", { className: "p-8 text-center border rounded-md", children: [_jsx(Database, { className: "h-10 w-10 mx-auto mb-4 text-muted-foreground" }), _jsx("p", { className: "text-muted-foreground", children: "Database connection management coming soon" })] }) })] }));
}
