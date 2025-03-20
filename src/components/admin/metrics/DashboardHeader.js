import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { RefreshCcw } from "lucide-react";
import { TimeRangeSelector } from "@/components/admin/metrics/TimeRangeSelector";
export function DashboardHeader({ timeRange, onTimeRangeChange, onRefresh }) {
    return (_jsxs("div", { className: "flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4", children: [_jsxs("div", { className: "flex items-center space-x-2", children: [_jsx("span", { className: "bg-clip-text text-transparent bg-gradient-to-r from-[#8B5CF6] via-[#D946EF] to-[#0EA5E9] animate-gradient-x", children: "Live Monitoring" }), _jsx("div", { className: "h-2 w-2 rounded-full bg-green-500 animate-pulse" })] }), _jsxs("div", { className: "flex flex-wrap gap-2", children: [_jsx(TimeRangeSelector, { selected: timeRange, onChange: onTimeRangeChange }), _jsxs("button", { onClick: onRefresh, className: "flex items-center gap-1 px-3 py-1.5 text-xs font-medium bg-[#1A1F2C]/60 text-white/70 hover:bg-[#1A1F2C]/90 hover:text-white/80 rounded-lg border border-white/10 transition-all", children: [_jsx(RefreshCcw, { size: 12 }), "Refresh"] })] })] }));
}
