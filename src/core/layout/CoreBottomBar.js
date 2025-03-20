import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState, useEffect } from "react";
import { cn } from "@/lib/utils";
import { LayoutZIndex } from "./types";
import { Bug, Activity } from "lucide-react";
import { Button } from "@/components/ui/button";
import { WebSocketLogger } from '@/services/chat/websocket/monitoring/WebSocketLogger';
import { DebugMetrics } from "@/components/debug/DebugPanel/DebugMetrics";
/**
 * @name CoreBottomBar
 * @description The bottom status bar component
 * DO NOT MODIFY THIS COMPONENT
 */
export function CoreBottomBar({ className }) {
    const [showDebug, setShowDebug] = useState(false);
    const [hasNewActivity, setHasNewActivity] = useState(false);
    useEffect(() => {
        const interval = setInterval(() => {
            const logger = WebSocketLogger.getInstance();
            const recentLogs = logger.getLogs().filter(log => Date.now() - log.timestamp < 5000);
            setHasNewActivity(recentLogs.length > 0);
        }, 1000);
        return () => clearInterval(interval);
    }, []);
    const handleDebugClick = () => {
        setShowDebug(!showDebug);
        setHasNewActivity(false);
    };
    return (_jsxs("footer", { className: cn("wf-core-bottombar h-12 glass-card border-t border-neon-blue/20 px-6", className), style: { zIndex: LayoutZIndex.navbar }, "data-testid": "core-bottombar", children: [_jsxs("div", { className: "h-full flex items-center justify-between", children: [_jsxs("div", { className: "flex items-center gap-4", children: [_jsx(Button, { variant: "ghost", size: "icon", onClick: handleDebugClick, className: cn("text-neon-pink hover:text-neon-blue transition-colors", showDebug && "text-neon-blue", hasNewActivity && "animate-pulse"), children: _jsx(Bug, { className: "w-5 h-5" }) }), _jsx(Button, { variant: "ghost", size: "icon", className: cn("text-neon-pink hover:text-neon-blue transition-colors", hasNewActivity && "text-neon-blue animate-pulse"), children: _jsx(Activity, { className: "w-5 h-5" }) })] }), _jsxs("div", { className: "flex items-center gap-2", children: [_jsx("span", { className: "text-sm text-neon-pink", children: "\u00A9 2024 wiredFRONT" }), _jsx("span", { className: "text-sm text-neon-blue", children: "v1.0.0" })] })] }), showDebug && _jsx(DebugMetrics, {})] }));
}
