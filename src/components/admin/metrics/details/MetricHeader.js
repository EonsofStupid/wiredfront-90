import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { cn } from "@/lib/utils";
export function MetricHeader({ metric }) {
    return (_jsxs("div", { className: "flex justify-between items-center", children: [_jsxs("div", { children: [_jsx("h3", { className: "text-sm text-white/70", children: "Current Value" }), _jsxs("div", { className: "text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-white/70", children: [metric.value.toLocaleString(), " ", metric.unit] }), _jsx("div", { className: "text-sm mt-1", children: _jsxs("span", { className: cn("inline-flex items-center", metric.trend === 'up' ? "text-green-500" :
                                metric.trend === 'down' ? "text-red-500" :
                                    "text-yellow-500"), children: [metric.change, "% from previous period"] }) })] }), _jsxs("div", { className: "flex gap-2", children: [_jsx("button", { className: "hover:bg-white/10 p-2 rounded", children: _jsx(Download, { size: 16, className: "text-white/70" }) }), _jsx("button", { className: "hover:bg-white/10 p-2 rounded", children: _jsx(ZoomIn, { size: 16, className: "text-white/70" }) })] })] }));
}
import { Download, ZoomIn } from "lucide-react";
