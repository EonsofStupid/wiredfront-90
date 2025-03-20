import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Search, Filter } from 'lucide-react';
export function FeatureFlagSearch({ searchQuery, onSearchChange }) {
    return (_jsxs("div", { className: "flex justify-between items-center space-x-2", children: [_jsxs("div", { className: "relative flex-1", children: [_jsx(Search, { className: "absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" }), _jsx(Input, { type: "search", placeholder: "Search feature flags...", className: "pl-8 bg-background", value: searchQuery, onChange: (e) => onSearchChange(e.target.value) })] }), _jsx(Button, { variant: "outline", size: "icon", children: _jsx(Filter, { className: "h-4 w-4" }) })] }));
}
