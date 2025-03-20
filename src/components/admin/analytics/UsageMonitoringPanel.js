import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Download } from "lucide-react";
export const UsageMonitoringPanel = () => {
    const [timeRange, setTimeRange] = useState("7d"); // 24h, 7d, 30d, all
    const { data: usageMetrics, isLoading, error } = useQuery({
        queryKey: ['admin', 'rag-metrics', timeRange],
        queryFn: async () => {
            // Calculate date filter based on timeRange
            let fromDate = null;
            if (timeRange !== 'all') {
                const now = new Date();
                if (timeRange === '24h') {
                    fromDate = new Date(now.getTime() - 24 * 60 * 60 * 1000).toISOString();
                }
                else if (timeRange === '7d') {
                    fromDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000).toISOString();
                }
                else if (timeRange === '30d') {
                    fromDate = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000).toISOString();
                }
            }
            // First, get the RAG metrics
            let query = supabase.from('rag_metrics').select('*');
            // Add time range filter if applicable
            if (fromDate) {
                query = query.gte('created_at', fromDate);
            }
            const { data: metricsData, error: metricsError } = await query;
            if (metricsError)
                throw metricsError;
            // Next, get the user profiles to map usernames
            const { data: profiles, error: profilesError } = await supabase
                .from('profiles')
                .select('id, username');
            if (profilesError)
                throw profilesError;
            // Map the usernames to the metrics data
            const metricsWithUsernames = metricsData.map((metric) => {
                const profile = profiles.find((p) => p.id === metric.user_id);
                return {
                    ...metric,
                    username: profile?.username || metric.user_id.substring(0, 8)
                };
            });
            return metricsWithUsernames;
        },
        refetchInterval: 30000 // Refresh every 30 seconds
    });
    const downloadReport = () => {
        if (!usageMetrics)
            return;
        // Format data for CSV
        const csvContent = [
            // Header row
            ["User", "Queries", "Vectors", "Tokens", "Avg Latency (ms)", "Last Updated"].join(","),
            // Data rows
            ...usageMetrics.map(metric => [
                metric.username || metric.user_id.substring(0, 8),
                metric.query_count,
                metric.vector_count,
                metric.token_usage,
                metric.average_latency,
                new Date(metric.updated_at).toLocaleString()
            ].join(","))
        ].join("\n");
        // Create download link
        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.setAttribute("href", url);
        link.setAttribute("download", `rag-usage-report-${timeRange}.csv`);
        link.style.visibility = 'hidden';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };
    // Prepare data for charts
    const chartData = usageMetrics?.map(metric => ({
        name: metric.username || metric.user_id.substring(0, 8),
        queries: metric.query_count,
        vectors: metric.vector_count,
        tokens: metric.token_usage
    })) || [];
    if (isLoading)
        return _jsx("div", { children: "Loading usage data..." });
    if (error)
        return _jsxs("div", { children: ["Error loading usage data: ", error.message] });
    return (_jsxs("div", { className: "space-y-6", children: [_jsxs("div", { className: "flex items-center justify-between", children: [_jsxs("div", { children: [_jsx("h2", { className: "text-2xl font-bold", children: "RAG Usage Analytics" }), _jsx("p", { className: "text-muted-foreground", children: "Monitor vector storage and query usage across users" })] }), _jsxs("div", { className: "flex items-center space-x-2", children: [_jsxs(Select, { value: timeRange, onValueChange: setTimeRange, children: [_jsx(SelectTrigger, { className: "w-[180px]", children: _jsx(SelectValue, { placeholder: "Select time range" }) }), _jsxs(SelectContent, { children: [_jsx(SelectItem, { value: "24h", children: "Last 24 Hours" }), _jsx(SelectItem, { value: "7d", children: "Last 7 Days" }), _jsx(SelectItem, { value: "30d", children: "Last 30 Days" }), _jsx(SelectItem, { value: "all", children: "All Time" })] })] }), _jsxs(Button, { onClick: downloadReport, variant: "outline", children: [_jsx(Download, { className: "mr-2 h-4 w-4" }), "Export"] })] })] }), _jsxs("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-6", children: [_jsxs(Card, { children: [_jsxs(CardHeader, { children: [_jsx(CardTitle, { children: "Query Usage" }), _jsx(CardDescription, { children: "Number of RAG queries by user" })] }), _jsx(CardContent, { children: _jsx("div", { className: "h-[300px]", children: _jsx(ResponsiveContainer, { width: "100%", height: "100%", children: _jsxs(BarChart, { data: chartData, children: [_jsx(CartesianGrid, { strokeDasharray: "3 3" }), _jsx(XAxis, { dataKey: "name" }), _jsx(YAxis, {}), _jsx(Tooltip, {}), _jsx(Bar, { dataKey: "queries", fill: "#8884d8" })] }) }) }) })] }), _jsxs(Card, { children: [_jsxs(CardHeader, { children: [_jsx(CardTitle, { children: "Vector Storage" }), _jsx(CardDescription, { children: "Number of vectors stored by user" })] }), _jsx(CardContent, { children: _jsx("div", { className: "h-[300px]", children: _jsx(ResponsiveContainer, { width: "100%", height: "100%", children: _jsxs(BarChart, { data: chartData, children: [_jsx(CartesianGrid, { strokeDasharray: "3 3" }), _jsx(XAxis, { dataKey: "name" }), _jsx(YAxis, {}), _jsx(Tooltip, {}), _jsx(Bar, { dataKey: "vectors", fill: "#82ca9d" })] }) }) }) })] })] }), _jsxs(Card, { children: [_jsxs(CardHeader, { children: [_jsx(CardTitle, { children: "Detailed Usage Metrics" }), _jsx(CardDescription, { children: "Complete breakdown of RAG usage per user" })] }), _jsx(CardContent, { children: _jsxs(Table, { children: [_jsx(TableHeader, { children: _jsxs(TableRow, { children: [_jsx(TableHead, { children: "User" }), _jsx(TableHead, { children: "Queries" }), _jsx(TableHead, { children: "Vectors Stored" }), _jsx(TableHead, { children: "Tokens Used" }), _jsx(TableHead, { children: "Avg. Latency (ms)" }), _jsx(TableHead, { children: "Last Updated" })] }) }), _jsx(TableBody, { children: usageMetrics?.map(metric => (_jsxs(TableRow, { children: [_jsx(TableCell, { className: "font-medium", children: metric.username || metric.user_id.substring(0, 8) }), _jsx(TableCell, { children: metric.query_count }), _jsx(TableCell, { children: metric.vector_count }), _jsx(TableCell, { children: metric.token_usage }), _jsx(TableCell, { children: metric.average_latency.toFixed(2) }), _jsx(TableCell, { children: new Date(metric.updated_at).toLocaleString() })] }, metric.id))) })] }) })] })] }));
};
