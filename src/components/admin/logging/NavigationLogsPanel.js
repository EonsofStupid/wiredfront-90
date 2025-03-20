import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { RouteLoggingService } from "@/services/navigation/RouteLoggingService";
import { formatDistanceToNow } from "date-fns";
import { Loader2, RotateCcw, Download, Filter } from "lucide-react";
export function NavigationLogsPanel() {
    const [logs, setLogs] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const [view, setView] = useState('all');
    const fetchLogs = async () => {
        setIsLoading(true);
        setError(null);
        try {
            const navigationLogs = await RouteLoggingService.getNavigationLogs(50, view === 'all');
            setLogs(navigationLogs);
        }
        catch (err) {
            setError(err.message || 'Failed to load navigation logs');
        }
        finally {
            setIsLoading(false);
        }
    };
    useEffect(() => {
        fetchLogs();
    }, [view]);
    const downloadLogs = () => {
        const blob = new Blob([JSON.stringify(logs, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `navigation-logs-${new Date().toISOString().split('T')[0]}.json`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    };
    return (_jsxs(Card, { children: [_jsxs(CardHeader, { className: "flex flex-row items-center justify-between", children: [_jsx(CardTitle, { children: "Navigation Logs" }), _jsxs("div", { className: "flex space-x-2", children: [_jsxs(Button, { variant: "outline", size: "sm", onClick: fetchLogs, disabled: isLoading, children: [isLoading ? (_jsx(Loader2, { className: "h-4 w-4 animate-spin" })) : (_jsx(RotateCcw, { className: "h-4 w-4" })), _jsx("span", { className: "ml-2", children: "Refresh" })] }), _jsxs(Button, { variant: "outline", size: "sm", onClick: downloadLogs, disabled: isLoading || logs.length === 0, children: [_jsx(Download, { className: "h-4 w-4" }), _jsx("span", { className: "ml-2", children: "Export" })] })] })] }), _jsx(CardContent, { children: _jsxs(Tabs, { defaultValue: "all", value: view, onValueChange: (v) => setView(v), children: [_jsxs("div", { className: "flex items-center justify-between mb-4", children: [_jsxs(TabsList, { children: [_jsx(TabsTrigger, { value: "all", children: "All Users" }), _jsx(TabsTrigger, { value: "user", children: "Current User" })] }), _jsxs(Badge, { variant: "outline", className: "flex items-center", children: [_jsx(Filter, { className: "h-3 w-3 mr-1" }), logs.length, " Logs"] })] }), _jsx(TabsContent, { value: "all", className: "mt-0", children: _jsx(NavigationLogsList, { logs: logs, isLoading: isLoading, error: error }) }), _jsx(TabsContent, { value: "user", className: "mt-0", children: _jsx(NavigationLogsList, { logs: logs, isLoading: isLoading, error: error }) })] }) })] }));
}
function NavigationLogsList({ logs, isLoading, error }) {
    if (isLoading) {
        return (_jsx("div", { className: "flex justify-center items-center h-48", children: _jsx(Loader2, { className: "h-8 w-8 animate-spin text-primary" }) }));
    }
    if (error) {
        return (_jsx("div", { className: "text-center text-red-500 p-4 border border-red-200 rounded", children: error }));
    }
    if (logs.length === 0) {
        return (_jsx("div", { className: "text-center text-muted-foreground p-8", children: "No navigation logs found" }));
    }
    return (_jsx(ScrollArea, { className: "h-[400px]", children: _jsx("div", { className: "space-y-2", children: logs.map((log) => (_jsxs("div", { className: "p-3 border rounded-md hover:bg-accent/10 transition-colors", children: [_jsxs("div", { className: "flex justify-between items-start", children: [_jsxs("div", { children: [_jsx("p", { className: "font-medium", children: log.message }), _jsxs("div", { className: "flex flex-wrap gap-2 mt-1", children: [(log.metadata.previousRoute || log.metadata.from) && (_jsxs(Badge, { variant: "outline", className: "text-xs", children: ["From: ", log.metadata.previousRoute || log.metadata.from] })), (log.metadata.currentRoute || log.metadata.to) && (_jsxs(Badge, { variant: "secondary", className: "text-xs", children: ["To: ", log.metadata.currentRoute || log.metadata.to] }))] })] }), _jsx("div", { className: "text-xs text-muted-foreground", children: log.timestamp && formatDistanceToNow(new Date(log.timestamp), { addSuffix: true }) })] }), log.user_id && (_jsxs("div", { className: "mt-2 text-xs text-muted-foreground", children: ["User ID: ", log.user_id] }))] }, log.id))) }) }));
}
