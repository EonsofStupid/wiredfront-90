
import React, { useState, useEffect } from "react";
import { cn } from "@/lib/utils";
import { BottomBarProps, LayoutZIndex } from "./types";
import { Bug, Activity, Wrench } from "lucide-react";
import { Button } from "@/components/ui/button";
import { WebSocketLogger } from '@/services/chat/websocket/monitoring/WebSocketLogger';
import { DebugMetrics } from "@/components/debug/DebugPanel/DebugMetrics";
import { ZIndexVisualizer } from "@/components/debug/ZIndexVisualizer";

/**
 * @name CoreBottomBar
 * @description The bottom status bar component
 * DO NOT MODIFY THIS COMPONENT
 */
export function CoreBottomBar({ className }: BottomBarProps) {
  const [showDebug, setShowDebug] = useState(false);
  const [showZIndexVisualizer, setShowZIndexVisualizer] = useState(false);
  const [hasNewActivity, setHasNewActivity] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      const logger = WebSocketLogger.getInstance();
      const recentLogs = logger.getLogs().filter(
        log => Date.now() - log.timestamp < 5000
      );
      setHasNewActivity(recentLogs.length > 0);
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const handleDebugClick = () => {
    setShowDebug(!showDebug);
    setHasNewActivity(false);
  };

  const handleZIndexVisualizerClick = () => {
    setShowZIndexVisualizer(!showZIndexVisualizer);
  };

  return (
    <footer 
      className={cn(
        "wf-core-bottombar h-12 glass-card border-t border-neon-blue/20 px-6", 
        className
      )}
      style={{ zIndex: LayoutZIndex.bottombar }}
      data-testid="core-bottombar"
    >
      <div className="h-full flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={handleDebugClick}
            className={cn(
              "text-neon-pink hover:text-neon-blue transition-colors",
              showDebug && "text-neon-blue",
              hasNewActivity && "animate-pulse"
            )}
            title="Debug Panel"
          >
            <Bug className="w-5 h-5" />
          </Button>
          
          <Button
            variant="ghost"
            size="icon"
            className={cn(
              "text-neon-pink hover:text-neon-blue transition-colors",
              hasNewActivity && "text-neon-blue animate-pulse"
            )}
            title="Activity Monitor"
          >
            <Activity className="w-5 h-5" />
          </Button>
          
          <Button
            variant="ghost"
            size="icon"
            onClick={handleZIndexVisualizerClick}
            className={cn(
              "text-neon-pink hover:text-neon-blue transition-colors",
              showZIndexVisualizer && "text-neon-blue"
            )}
            title="Z-Index Visualizer"
          >
            <Wrench className="w-5 h-5" />
          </Button>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-sm text-neon-pink">© 2024 wiredFRONT</span>
          <span className="text-sm text-neon-blue">v1.0.0</span>
        </div>
      </div>
      {showDebug && <DebugMetrics />}
      {showZIndexVisualizer && <ZIndexVisualizer />}
    </footer>
  );
}
