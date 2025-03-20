import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
export function SettingsContainer({ title, description, children }) {
    return (_jsxs("div", { className: "space-y-6", children: [_jsxs("div", { children: [_jsx("h3", { className: "text-lg font-medium", children: title }), description && (_jsx("p", { className: "text-sm text-muted-foreground", children: description }))] }), children] }));
}
