import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Clock } from "lucide-react";
export function MetricSummaryCards({ data, unit }) {
    // Calculate metrics
    const maxValue = Math.max(...data.map(d => d.value));
    const avgValue = Math.round(data.reduce((acc, curr) => acc + curr.value, 0) / data.length);
    return (_jsxs("div", { className: "grid grid-cols-1 md:grid-cols-3 gap-4", children: [_jsxs("div", { className: "bg-[#1A1F2C]/60 p-4 rounded-lg border border-white/10", children: [_jsx("div", { className: "text-white/70 text-sm", children: "Peak Value" }), _jsxs("div", { className: "text-xl font-medium mt-1", children: [maxValue.toLocaleString(), " ", unit] })] }), _jsxs("div", { className: "bg-[#1A1F2C]/60 p-4 rounded-lg border border-white/10", children: [_jsx("div", { className: "text-white/70 text-sm", children: "Average" }), _jsxs("div", { className: "text-xl font-medium mt-1", children: [avgValue.toLocaleString(), " ", unit] })] }), _jsxs("div", { className: "bg-[#1A1F2C]/60 p-4 rounded-lg border border-white/10", children: [_jsx("div", { className: "text-white/70 text-sm", children: "Last Updated" }), _jsxs("div", { className: "text-xl font-medium mt-1 flex items-center", children: [_jsx(Clock, { size: 14, className: "mr-1" }), "Just now"] })] })] }));
}
