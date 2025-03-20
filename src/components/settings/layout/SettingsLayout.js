import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Settings as SettingsIcon } from "lucide-react";
export function SettingsLayout({ children, defaultTab = "general" }) {
    return (_jsxs("div", { className: "container mx-auto p-6 space-y-6", children: [_jsxs("div", { className: "flex items-center gap-2 mb-6", children: [_jsx(SettingsIcon, { className: "w-6 h-6 text-neon-blue" }), _jsx("h1", { className: "text-2xl font-bold gradient-text", children: "Settings" })] }), children] }));
}
