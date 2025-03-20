import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { cn } from "@/lib/utils";
import { ArrowUpDown, Download, LayoutGrid } from "lucide-react";
export function ChartControls({ metrics, activeMetric, setActiveMetric, chartType, setChartType }) {
    return (_jsxs("div", { className: "flex flex-wrap gap-2", children: [_jsx("div", { className: "flex rounded-lg overflow-hidden border border-white/10", children: metrics.map((metric) => (_jsx("button", { onClick: () => setActiveMetric(metric.id), className: cn("px-3 py-1 text-xs font-medium transition-all", activeMetric === metric.id
                        ? "bg-gradient-to-r from-[#8B5CF6]/30 to-[#D946EF]/30 text-white"
                        : "bg-[#1A1F2C]/60 text-white/60 hover:bg-[#1A1F2C]/90 hover:text-white/80"), style: {
                        boxShadow: activeMetric === metric.id ? `0 0 10px ${metric.color}40` : 'none'
                    }, children: metric.name }, metric.id))) }), _jsxs("div", { className: "flex rounded-lg overflow-hidden border border-white/10", children: [_jsx("button", { onClick: () => setChartType('line'), className: cn("p-1 transition-all", chartType === 'line'
                            ? "bg-gradient-to-r from-[#8B5CF6]/30 to-[#D946EF]/30 text-white"
                            : "bg-[#1A1F2C]/60 text-white/60 hover:bg-[#1A1F2C]/90 hover:text-white/80"), children: _jsx(ArrowUpDown, { className: "h-4 w-4" }) }), _jsx("button", { onClick: () => setChartType('area'), className: cn("p-1 transition-all", chartType === 'area'
                            ? "bg-gradient-to-r from-[#8B5CF6]/30 to-[#D946EF]/30 text-white"
                            : "bg-[#1A1F2C]/60 text-white/60 hover:bg-[#1A1F2C]/90 hover:text-white/80"), children: _jsx(LayoutGrid, { className: "h-4 w-4" }) })] }), _jsxs("button", { className: "flex items-center gap-1 px-3 py-1 text-xs font-medium bg-[#1A1F2C]/60 text-white/60 hover:bg-[#1A1F2C]/90 hover:text-white/80 rounded-lg border border-white/10 transition-all", onClick: () => {
                    // In a real app, this would trigger an export
                    alert("Export feature would be implemented here");
                }, children: [_jsx(Download, { className: "h-3 w-3" }), "Export"] })] }));
}
