import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Card, CardHeader, CardContent, CardFooter } from '@/components/ui/card';
export function FeatureFlagSkeleton() {
    return (_jsx("div", { className: "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6", children: Array.from({ length: 6 }).map((_, i) => (_jsxs(Card, { className: "animate-pulse", children: [_jsxs(CardHeader, { className: "pb-2", children: [_jsx("div", { className: "h-5 bg-muted rounded w-2/3" }), _jsx("div", { className: "h-4 bg-muted rounded w-1/2 mt-2" })] }), _jsx(CardContent, { className: "pb-2", children: _jsx("div", { className: "h-8 bg-muted rounded w-full mt-2" }) }), _jsx(CardFooter, { children: _jsx("div", { className: "h-5 bg-muted rounded w-1/4" }) })] }, i))) }));
}
