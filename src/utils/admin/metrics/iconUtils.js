import { jsx as _jsx } from "react/jsx-runtime";
import { AreaChart, Cpu, Database, DollarSign, Server, Users, Zap } from "lucide-react";
export function getMetricIcon(metricName) {
    const icons = {
        active_users: _jsx(Users, { className: "h-5 w-5" }),
        api_requests: _jsx(Zap, { className: "h-5 w-5" }),
        response_time: _jsx(AreaChart, { className: "h-5 w-5" }),
        cpu_usage: _jsx(Cpu, { className: "h-5 w-5" }),
        memory_usage: _jsx(Database, { className: "h-5 w-5" }),
        revenue: _jsx(DollarSign, { className: "h-5 w-5" }),
    };
    // Check if metricName contains revenue (case insensitive)
    if (metricName.toLowerCase().includes('revenue')) {
        return icons.revenue;
    }
    return icons[metricName.toLowerCase().replace(/\s/g, '_')] || _jsx(Server, { className: "h-5 w-5" });
}
