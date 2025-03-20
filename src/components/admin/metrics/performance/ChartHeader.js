import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { ArrowUpDown } from "lucide-react";
export function ChartHeader({ title, description }) {
    return (_jsxs("div", { children: [_jsxs("h3", { className: "text-lg font-semibold text-white flex items-center", children: [_jsx(ArrowUpDown, { className: "h-5 w-5 text-[#8B5CF6] mr-2" }), title] }), _jsx("p", { className: "text-sm text-white/60 mt-1", children: description })] }));
}
