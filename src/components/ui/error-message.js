import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { AlertCircle } from "lucide-react";
import { cn } from "@/lib/utils";
export function ErrorMessage({ message, className }) {
    return (_jsxs("div", { className: cn("flex items-center gap-2 p-3 rounded-md", "bg-gradient-to-r from-neon-pink/20 to-red-500/20 text-white", "border border-neon-pink/30 backdrop-blur-sm", className), children: [_jsx(AlertCircle, { className: "h-5 w-5 text-neon-pink" }), _jsx("p", { className: "text-sm", children: message })] }));
}
