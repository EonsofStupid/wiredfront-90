import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useEffect, useState } from 'react';
import { Card } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { messageCache } from '@/services/chat/MessageCacheService';
import { Badge } from "@/components/ui/badge";
import { RefreshCw, Trash2 } from 'lucide-react';
import { toast } from 'sonner';
export const CacheMetricsPanel = () => {
    const [metrics, setMetrics] = useState(null);
    const [isRefreshing, setIsRefreshing] = useState(false);
    const [isClearing, setIsClearing] = useState(false);
    const fetchMetrics = async () => {
        setIsRefreshing(true);
        try {
            const currentMetrics = await messageCache.getMetrics();
            setMetrics(currentMetrics);
        }
        catch (error) {
            console.error('Failed to fetch cache metrics:', error);
            toast.error('Failed to fetch metrics');
        }
        finally {
            setIsRefreshing(false);
        }
    };
    const clearCache = async () => {
        setIsClearing(true);
        try {
            await messageCache.clearAllCache();
            toast.success('Cache cleared successfully');
            await fetchMetrics();
        }
        catch (error) {
            console.error('Failed to clear cache:', error);
            toast.error('Failed to clear cache');
        }
        finally {
            setIsClearing(false);
        }
    };
    useEffect(() => {
        fetchMetrics();
        const interval = setInterval(fetchMetrics, 5000);
        return () => clearInterval(interval);
    }, []);
    if (!metrics)
        return null;
    const hitRate = metrics.cacheHits + metrics.cacheMisses > 0
        ? ((metrics.cacheHits / (metrics.cacheHits + metrics.cacheMisses)) * 100).toFixed(1)
        : '0';
    const syncRate = metrics.syncAttempts > 0
        ? ((metrics.syncSuccesses / metrics.syncAttempts) * 100).toFixed(1)
        : '0';
    return (_jsx(Card, { className: "fixed top-16 right-4 w-80 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 shadow-lg border-muted", style: { zIndex: 'var(--z-dropdown)' }, children: _jsxs("div", { className: "p-4", children: [_jsxs("div", { className: "flex items-center justify-between mb-4", children: [_jsx("h3", { className: "text-sm font-semibold", children: "Cache Metrics Debug Panel" }), _jsxs("div", { className: "flex gap-2", children: [_jsx(RefreshCw, { className: `h-4 w-4 cursor-pointer ${isRefreshing ? 'animate-spin' : ''}`, onClick: fetchMetrics }), _jsx(Trash2, { className: `h-4 w-4 cursor-pointer text-destructive ${isClearing ? 'opacity-50' : ''}`, onClick: clearCache })] })] }), _jsxs("div", { className: "space-y-2", children: [_jsxs("div", { className: "flex justify-between items-center", children: [_jsx("span", { className: "text-xs text-muted-foreground", children: "Cache Hits" }), _jsx(Badge, { variant: "secondary", children: metrics.cacheHits })] }), _jsxs("div", { className: "flex justify-between items-center", children: [_jsx("span", { className: "text-xs text-muted-foreground", children: "Cache Misses" }), _jsx(Badge, { variant: "secondary", children: metrics.cacheMisses })] }), _jsxs("div", { className: "flex justify-between items-center", children: [_jsx("span", { className: "text-xs text-muted-foreground", children: "Hit Rate" }), _jsxs(Badge, { variant: "secondary", children: [hitRate, "%"] })] }), _jsxs("div", { className: "flex justify-between items-center", children: [_jsx("span", { className: "text-xs text-muted-foreground", children: "Sync Attempts" }), _jsx(Badge, { variant: "secondary", children: metrics.syncAttempts })] }), _jsxs("div", { className: "flex justify-between items-center", children: [_jsx("span", { className: "text-xs text-muted-foreground", children: "Sync Successes" }), _jsx(Badge, { variant: "secondary", children: metrics.syncSuccesses })] }), _jsxs("div", { className: "flex justify-between items-center", children: [_jsx("span", { className: "text-xs text-muted-foreground", children: "Sync Rate" }), _jsxs(Badge, { variant: "secondary", children: [syncRate, "%"] })] })] }), metrics.errors.length > 0 && (_jsxs("div", { className: "mt-4", children: [_jsxs("div", { className: "flex items-center justify-between mb-2", children: [_jsx("h4", { className: "text-xs font-semibold", children: "Recent Errors" }), _jsxs("span", { className: "text-xs text-muted-foreground", children: [metrics.errors.length, " error", metrics.errors.length !== 1 ? 's' : ''] })] }), _jsx(ScrollArea, { className: "h-32", children: _jsx("div", { className: "space-y-2", children: metrics.errors.map((error, index) => (_jsxs("div", { className: "text-xs p-2 rounded bg-destructive/10 text-destructive", children: [_jsx("div", { className: "font-mono", children: new Date(error.timestamp).toLocaleTimeString() }), _jsx("div", { children: error.error })] }, index))) }) })] }))] }) }));
};
