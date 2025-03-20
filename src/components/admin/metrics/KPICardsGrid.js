import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { DynamicKPICard } from "@/components/admin/metrics/DynamicKPICard";
import { AdminCard } from "@/components/admin/ui/AdminCard";
import { Skeleton } from "@/components/ui/skeleton";
export function KPICardsGrid({ metrics, revenueMetric, onMetricClick, getMetricIcon, isLoading = false }) {
    if (isLoading) {
        return (_jsx("div", { className: "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4", children: [...Array(6)].map((_, index) => (_jsx(Skeleton, { className: "h-40 w-full rounded-xl" }, `skeleton-${index}`))) }));
    }
    return (_jsxs("div", { className: "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4", children: [_jsx(DynamicKPICard, { title: revenueMetric.label, value: revenueMetric.value, unit: revenueMetric.unit, trend: revenueMetric.trend, change: revenueMetric.change, icon: getMetricIcon('revenue'), onClick: () => onMetricClick(revenueMetric) }, "revenue-card"), metrics && metrics.length > 0 ? (metrics.map((metric) => (_jsx(DynamicKPICard, { title: metric.label, value: metric.value, unit: metric.unit, trend: metric.trend, change: metric.change || 0, icon: getMetricIcon(metric.label.toLowerCase().replace(/\s/g, '_')), onClick: () => onMetricClick(metric) }, metric.id)))) : (_jsx(AdminCard, { className: "col-span-3 p-6 text-center", children: _jsx("p", { children: "No metrics data found. Sample data will be loaded shortly." }) }))] }));
}
