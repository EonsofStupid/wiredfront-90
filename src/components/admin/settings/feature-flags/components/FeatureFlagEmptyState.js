import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Info, Plus } from 'lucide-react';
export function FeatureFlagEmptyState({ onCreateFlag, isSuperAdmin, searchQuery }) {
    return (_jsx(Card, { className: "bg-background border-dashed border-2", children: _jsxs(CardContent, { className: "flex flex-col items-center justify-center py-10", children: [_jsx(Info, { className: "h-10 w-10 text-muted-foreground mb-4" }), _jsx("p", { className: "text-lg font-medium text-center", children: "No feature flags found" }), _jsx("p", { className: "text-muted-foreground text-center mt-1", children: searchQuery
                        ? "Try adjusting your search criteria"
                        : "Create your first feature flag to get started" }), isSuperAdmin && !searchQuery && (_jsxs(Button, { onClick: onCreateFlag, className: "mt-4", children: [_jsx(Plus, { className: "h-4 w-4 mr-2" }), "New Feature Flag"] }))] }) }));
}
