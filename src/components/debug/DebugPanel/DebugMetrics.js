import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useEffect, useState } from 'react';
import { Card } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { WebSocketLogger } from '@/services/chat/websocket/monitoring/WebSocketLogger';
export const DebugMetrics = () => {
    const [metrics, setMetrics] = useState(null);
    const [activeTab, setActiveTab] = useState('metrics');
    const [hasNewInfo, setHasNewInfo] = useState(false);
    useEffect(() => {
        const updateMetrics = () => {
            const logger = WebSocketLogger.getInstance();
            const currentMetrics = logger.getMetrics();
            const newMetrics = {
                connectionState: logger.getConnectionState(),
                messagesSent: currentMetrics.messagesSent,
                messagesReceived: currentMetrics.messagesReceived,
                errors: logger.getLogs()
                    .filter(log => log.level === 'error')
                    .map(log => ({
                    timestamp: log.timestamp,
                    error: log.message
                })),
                latency: currentMetrics.latency,
                uptime: currentMetrics.uptime,
                reconnectAttempts: currentMetrics.reconnectAttempts
            };
            setMetrics(newMetrics);
            setHasNewInfo(true);
        };
        updateMetrics();
        const interval = setInterval(updateMetrics, 1000);
        return () => clearInterval(interval);
    }, []);
    const handleTabChange = (value) => {
        setActiveTab(value);
        if (value === 'metrics' || value === 'audit') {
            setHasNewInfo(false);
        }
    };
    if (!metrics)
        return null;
    return (_jsx(Card, { className: "fixed bottom-20 right-4 w-96 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60", children: _jsxs(Tabs, { value: activeTab, onValueChange: handleTabChange, children: [_jsxs(TabsList, { className: "w-full", children: [_jsx(TabsTrigger, { value: "metrics", className: hasNewInfo ? 'text-neon-blue animate-pulse' : '', children: "Metrics" }), _jsx(TabsTrigger, { value: "audit", children: "Audit" }), _jsx(TabsTrigger, { value: "logs", children: "Logs" })] }), _jsx(TabsContent, { value: "metrics", className: "p-4 space-y-4", children: _jsxs("div", { className: "space-y-2", children: [_jsxs("div", { className: "flex justify-between items-center", children: [_jsx("span", { className: "text-sm", children: "Connection State" }), _jsx(Badge, { variant: metrics.connectionState === 'connected' ? 'default' : 'destructive', children: metrics.connectionState })] }), _jsxs("div", { className: "flex justify-between items-center", children: [_jsx("span", { className: "text-sm", children: "Messages Sent" }), _jsx(Badge, { variant: "secondary", children: metrics.messagesSent })] }), _jsxs("div", { className: "flex justify-between items-center", children: [_jsx("span", { className: "text-sm", children: "Messages Received" }), _jsx(Badge, { variant: "secondary", children: metrics.messagesReceived })] }), _jsxs("div", { className: "flex justify-between items-center", children: [_jsx("span", { className: "text-sm", children: "Latency" }), _jsxs(Badge, { variant: "secondary", children: [metrics.latency, "ms"] })] }), _jsxs("div", { className: "flex justify-between items-center", children: [_jsx("span", { className: "text-sm", children: "Uptime" }), _jsxs(Badge, { variant: "secondary", children: [Math.floor(metrics.uptime / 1000), "s"] })] }), _jsxs("div", { className: "flex justify-between items-center", children: [_jsx("span", { className: "text-sm", children: "Reconnect Attempts" }), _jsx(Badge, { variant: "secondary", children: metrics.reconnectAttempts })] })] }) }), _jsx(TabsContent, { value: "audit", className: "p-4", children: _jsx(ScrollArea, { className: "h-[300px]", children: metrics.errors.map((error, index) => (_jsxs("div", { className: "mb-2 p-2 rounded bg-destructive/10 text-destructive", children: [_jsx("div", { className: "text-xs font-mono", children: new Date(error.timestamp).toLocaleTimeString() }), _jsx("div", { className: "text-sm", children: error.error })] }, index))) }) }), _jsx(TabsContent, { value: "logs", className: "p-4", children: _jsx(ScrollArea, { className: "h-[300px]", children: WebSocketLogger.getInstance().getLogs().map((log, index) => (_jsxs("div", { className: "mb-2 text-xs", children: [_jsx("span", { className: "font-mono", children: new Date(log.timestamp).toLocaleTimeString() }), _jsx("span", { className: "ml-2", children: log.message })] }, index))) }) })] }) }));
};
