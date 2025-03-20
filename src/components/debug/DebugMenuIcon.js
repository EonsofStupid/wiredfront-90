import { jsx as _jsx, Fragment as _Fragment, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from 'react';
import { Database } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { CacheMetricsPanel } from './CacheMetricsPanel';
export const DebugMenuIcon = () => {
    const [isOpen, setIsOpen] = useState(false);
    return (_jsxs(_Fragment, { children: [_jsx(Button, { variant: "ghost", size: "icon", onClick: () => setIsOpen(!isOpen), className: "relative text-neon-pink hover:text-neon-blue", title: "Debug Menu", children: _jsx(Database, { className: "h-5 w-5" }) }), isOpen && _jsx(CacheMetricsPanel, {})] }));
};
