import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
export function FeatureFlagHeader({ onCreateFlag, isSuperAdmin }) {
    return (_jsxs("div", { className: "flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4", children: [_jsxs("div", { children: [_jsx("h2", { className: "text-3xl font-bold tracking-tight", children: "Feature Flags" }), _jsx("p", { className: "text-muted-foreground", children: "Manage feature availability across the application." })] }), isSuperAdmin && (_jsxs(Button, { onClick: onCreateFlag, children: [_jsx(Plus, { className: "h-4 w-4 mr-2" }), "New Feature Flag"] }))] }));
}
