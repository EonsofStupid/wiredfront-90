import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Card } from "@/components/ui/card";
import { Settings } from "lucide-react";
export function SettingsContainer({ title, description, children }) {
    return (_jsxs("div", { className: "space-y-6", children: [_jsxs("div", { className: "flex items-center gap-2", children: [_jsx(Settings, { className: "h-5 w-5 text-muted-foreground" }), _jsx("h3", { className: "text-lg font-medium", children: title })] }), _jsx("p", { className: "text-sm text-muted-foreground", children: description }), _jsx(Card, { className: "p-6", children: children })] }));
}
