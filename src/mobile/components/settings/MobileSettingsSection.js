import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from "react";
import { ChevronDown, ChevronUp, User, Github, Palette, Webhook, Server, AlertTriangle } from "lucide-react";
export const MobileSettingsSection = ({ title, description, icon, children, defaultOpen = false }) => {
    const [isOpen, setIsOpen] = useState(defaultOpen);
    const getIcon = (name) => {
        switch (name) {
            case "user":
                return _jsx(User, { className: "h-5 w-5" });
            case "github":
                return _jsx(Github, { className: "h-5 w-5" });
            case "palette":
                return _jsx(Palette, { className: "h-5 w-5" });
            case "webhook":
                return _jsx(Webhook, { className: "h-5 w-5" });
            case "server":
                return _jsx(Server, { className: "h-5 w-5" });
            case "warning":
                return _jsx(AlertTriangle, { className: "h-5 w-5" });
            default:
                return null;
        }
    };
    return (_jsxs("div", { className: "border border-neon-blue/20 rounded-lg overflow-hidden bg-dark-lighter/10", children: [_jsxs("div", { className: "flex items-center justify-between p-4 cursor-pointer hover:bg-dark-lighter/20 transition-colors", onClick: () => setIsOpen(!isOpen), children: [_jsxs("div", { className: "flex items-center gap-3", children: [icon && (_jsx("div", { className: "text-neon-blue", children: getIcon(icon) })), _jsxs("div", { children: [_jsx("h3", { className: "font-medium", children: title }), description && (_jsx("p", { className: "text-sm text-muted-foreground", children: description }))] })] }), _jsx("div", { children: isOpen ? (_jsx(ChevronUp, { className: "h-5 w-5 text-muted-foreground" })) : (_jsx(ChevronDown, { className: "h-5 w-5 text-muted-foreground" })) })] }), isOpen && (_jsx("div", { className: "border-t border-neon-blue/10 animate-in fade-in-50 duration-200", children: children }))] }));
};
