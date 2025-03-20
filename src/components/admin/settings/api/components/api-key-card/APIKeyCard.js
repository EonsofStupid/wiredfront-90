import { jsx as _jsx, Fragment as _Fragment, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from "react";
import { Card, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ChevronDown, ChevronUp } from "lucide-react";
import { APIKeyCardHeader } from "./APIKeyCardHeader";
import { APIKeyDetails } from "./APIKeyDetails";
export function APIKeyCard({ config, onValidate, onDelete, onRefresh }) {
    const [expanded, setExpanded] = useState(false);
    return (_jsxs(Card, { className: "overflow-hidden border-gray-800 bg-slate-900/50 backdrop-blur-sm shadow-md hover:shadow-lg transition-shadow", children: [_jsx(APIKeyCardHeader, { config: config, onValidate: onValidate, onDelete: onDelete, onRefresh: onRefresh }), expanded && (_jsx(APIKeyDetails, { config: config })), _jsx(CardFooter, { className: "flex justify-center p-2 border-t border-gray-800 bg-slate-800/30", children: _jsx(Button, { variant: "ghost", size: "sm", onClick: () => setExpanded(!expanded), className: "text-gray-400 hover:text-gray-200", children: expanded ? (_jsxs(_Fragment, { children: [_jsx(ChevronUp, { className: "h-4 w-4 mr-1" }), _jsx("span", { children: "Show Less" })] })) : (_jsxs(_Fragment, { children: [_jsx(ChevronDown, { className: "h-4 w-4 mr-1" }), _jsx("span", { children: "Show More" })] })) }) })] }));
}
