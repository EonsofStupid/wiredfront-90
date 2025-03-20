import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { AdminCard, AdminCardTitle } from "@/components/admin/ui/AdminCard";
import { VectorDatabasePanel } from "@/components/admin/vectordb/VectorDatabasePanel";
import { Database } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
export default function VectorDatabasePage() {
    // Fetch vector indexing statistics
    const { data: stats = {
        total_vectors: 0,
        indexed_projects: 0,
        average_query_time: "N/A",
        last_reindex: "N/A"
    } } = useQuery({
        queryKey: ["vector-indexing-stats"],
        queryFn: async () => {
            // In a real implementation, this would fetch actual stats
            // For now, we'll simulate it with hardcoded data
            return {
                total_vectors: 250,
                indexed_projects: 18,
                average_query_time: "45ms",
                last_reindex: "2h ago"
            };
        },
        refetchInterval: 30000 // Refetch every 30 seconds
    });
    return (_jsxs("div", { className: "container max-w-7xl mx-auto py-10 space-y-6", children: [_jsx("h1", { className: "admin-heading text-3xl font-bold tracking-tight", children: "Vector Database Management" }), _jsx("p", { className: "text-muted-foreground", children: "Manage RAG vectors for AI retrieval, adjust indexing rules, and view which projects are indexed." }), _jsxs("div", { className: "grid gap-6", children: [_jsx(VectorDatabasePanel, {}), _jsxs("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-6", children: [_jsxs(AdminCard, { children: [_jsxs(AdminCardTitle, { className: "flex items-center gap-2", children: [_jsx(Database, { className: "h-5 w-5" }), "Indexing Rules"] }), _jsx("div", { className: "space-y-4", children: _jsxs("div", { className: "space-y-2", children: [_jsx("h3", { className: "font-medium", children: "Current Indexing Settings" }), _jsxs("div", { className: "grid grid-cols-2 gap-2 text-sm", children: [_jsx("div", { className: "font-medium", children: "Auto-index new projects:" }), _jsx("div", { children: "Enabled" }), _jsx("div", { className: "font-medium", children: "Vector dimensions:" }), _jsx("div", { children: "1536" }), _jsx("div", { className: "font-medium", children: "Indexing frequency:" }), _jsx("div", { children: "On content change" })] })] }) })] }), _jsxs(AdminCard, { children: [_jsxs(AdminCardTitle, { className: "flex items-center gap-2", children: [_jsx(Database, { className: "h-5 w-5" }), "System Status"] }), _jsx("div", { className: "space-y-4", children: _jsxs("div", { className: "grid grid-cols-2 gap-4 text-sm", children: [_jsxs("div", { children: [_jsx("p", { className: "text-muted-foreground", children: "Total Vectors" }), _jsx("p", { className: "text-2xl font-bold mt-1", children: stats.total_vectors })] }), _jsxs("div", { children: [_jsx("p", { className: "text-muted-foreground", children: "Indexed Projects" }), _jsx("p", { className: "text-2xl font-bold mt-1", children: stats.indexed_projects })] }), _jsxs("div", { children: [_jsx("p", { className: "text-muted-foreground", children: "Average Query Time" }), _jsx("p", { className: "text-2xl font-bold mt-1", children: stats.average_query_time })] }), _jsxs("div", { children: [_jsx("p", { className: "text-muted-foreground", children: "Last Reindex" }), _jsx("p", { className: "text-2xl font-bold mt-1", children: stats.last_reindex })] })] }) })] })] })] })] }));
}
