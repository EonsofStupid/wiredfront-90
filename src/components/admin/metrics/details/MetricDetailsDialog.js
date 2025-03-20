import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { StatusIndicator } from "../StatusIndicator";
import { useState } from "react";
import { generateDetailData } from "@/utils/admin/metrics/sampleData";
import { MetricHeader } from "./MetricHeader";
import { MetricTimeRange } from "./MetricTimeRange";
import { MetricDetailChart } from "./MetricDetailChart";
import { MetricSummaryCards } from "./MetricSummaryCards";
export function MetricDetailsDialog({ open, onOpenChange, metric }) {
    const [timeRange, setTimeRange] = useState('14d');
    const [detailData, setDetailData] = useState(() => generateDetailData());
    // Update data when time range changes
    const updateTimeRange = (range) => {
        setTimeRange(range);
        const days = parseInt(range.replace('d', ''));
        setDetailData(generateDetailData(days));
    };
    if (!metric)
        return null;
    return (_jsx(Dialog, { open: open, onOpenChange: onOpenChange, children: _jsxs(DialogContent, { className: "sm:max-w-[800px] bg-[#1A1F2C] border-[#8B5CF6]/30 text-white", children: [_jsxs(DialogHeader, { children: [_jsxs(DialogTitle, { className: "flex items-center gap-2 text-xl", children: [_jsx("span", { className: "bg-clip-text text-transparent bg-gradient-to-r from-[#8B5CF6] via-[#D946EF] to-[#0EA5E9]", children: metric.label }), _jsx(StatusIndicator, { status: metric.trend === 'up' ? 'healthy' : metric.trend === 'down' ? 'critical' : 'warning', label: metric.trend === 'up' ? 'Increasing' : metric.trend === 'down' ? 'Decreasing' : 'Stable' })] }), _jsx(DialogDescription, { className: "text-white/70", children: "Detailed analytics and historical data" })] }), _jsxs("div", { className: "space-y-6", children: [_jsx(MetricHeader, { metric: metric }), _jsx(MetricTimeRange, { selected: timeRange, onChange: updateTimeRange }), _jsx(MetricDetailChart, { data: detailData }), _jsx(MetricSummaryCards, { data: detailData, unit: metric.unit }), metric.description && (_jsxs("div", { className: "bg-[#1A1F2C]/60 p-4 rounded-lg border border-white/10", children: [_jsx("div", { className: "text-white/70 text-sm mb-2", children: "Analysis" }), _jsx("p", { className: "text-white/80 text-sm", children: metric.description })] }))] })] }) }));
}
