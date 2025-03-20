import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Card, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Lock } from "lucide-react";
export function AccessRestrictionCard() {
    return (_jsx(Card, { className: "border-destructive/50", children: _jsxs(CardHeader, { children: [_jsxs(CardTitle, { className: "flex items-center", children: [_jsx(Lock, { className: "w-5 h-5 mr-2 text-destructive" }), "Access Restricted"] }), _jsx(CardDescription, { children: "You don't have permission to manage API keys. This feature is restricted to Super Admin users." })] }) }));
}
