import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Clock, ArrowUpRight } from "lucide-react";
export function APIKeyCardFooter({ lastValidated }) {
    return (_jsx(CardFooter, { className: "bg-muted/40 border-t", children: _jsxs("div", { className: "w-full text-xs text-muted-foreground flex justify-between items-center", children: [_jsxs("div", { className: "flex items-center", children: [_jsx(Clock, { className: "h-3 w-3 mr-1" }), "Last validated: ", lastValidated
                            ? new Date(lastValidated).toLocaleString()
                            : 'Never'] }), _jsxs(Button, { variant: "link", size: "sm", className: "h-auto p-0 text-xs", children: ["View Details ", _jsx(ArrowUpRight, { className: "h-3 w-3 ml-0.5" })] })] }) }));
}
