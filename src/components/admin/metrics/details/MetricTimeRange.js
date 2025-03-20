import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Calendar } from "lucide-react";
import { cn } from "@/lib/utils";
export function MetricTimeRange({ selected, onChange }) {
    return (_jsxs("div", { className: "flex items-center justify-between", children: [_jsxs("div", { className: "flex items-center gap-2 text-white/70", children: [_jsx(Calendar, { size: 14 }), _jsx("span", { className: "text-sm", children: "Time Range" })] }), _jsx("div", { className: "flex rounded-lg overflow-hidden border border-white/10", children: ['7d', '14d', '30d', '90d'].map((range) => (_jsx("button", { onClick: () => onChange(range), className: cn("px-3 py-1 text-xs font-medium transition-all", selected === range
                        ? "bg-gradient-to-r from-[#8B5CF6]/30 to-[#D946EF]/30 text-white"
                        : "bg-[#1A1F2C]/60 text-white/60 hover:bg-[#1A1F2C]/90 hover:text-white/80"), children: range }, range))) })] }));
}
