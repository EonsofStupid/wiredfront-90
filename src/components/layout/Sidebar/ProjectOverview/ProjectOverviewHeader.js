import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { cn } from "@/lib/utils";
import { BookIcon } from "lucide-react";
export function ProjectOverviewHeader({ className }) {
    return (_jsx("div", { className: cn("p-4 border-b border-neon-blue/20", "bg-gradient-to-r from-neon-blue/10 to-transparent", className), children: _jsxs("h2", { className: "text-neon-blue font-medium text-xl flex items-center gap-2", children: [_jsx(BookIcon, { className: "h-5 w-5" }), "Project Hub"] }) }));
}
