import { CacheMetricsPanel } from "@/components/debug/CacheMetricsPanel";
import { DebugMetrics } from "@/components/debug/DebugPanel/DebugMetrics";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { WebSocketLogger } from "@/services/chat/websocket/monitoring/WebSocketLogger";
import { toggleZIndexDebug } from "@/utils/debug";
import { Activity, Bug, Wrench } from "lucide-react";
import { useEffect, useState } from "react";

interface BottomBarProps {
  className?: string;
}

export const BottomBar = ({ className }: BottomBarProps) => {
  const [showAnalytics, setShowAnalytics] = useState(false);
  const [showZDebug, setShowZDebug] = useState(false);
  const [showMetrics, setShowMetrics] = useState(false);
  const [hasNewActivity, setHasNewActivity] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      const logger = WebSocketLogger.getInstance();
      const recentLogs = logger
        .getLogs()
        .filter((log) => Date.now() - log.timestamp < 5000);
      setHasNewActivity(recentLogs.length > 0);
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const handleAnalyticsClick = () => {
    setShowAnalytics(!showAnalytics);
    setHasNewActivity(false);
  };

  const handleZDebugClick = () => {
    setShowZDebug(!showZDebug);
    toggleZIndexDebug();
  };

  const handleMetricsClick = () => {
    setShowMetrics(!showMetrics);
    setHasNewActivity(false);
  };

  return (
    <footer
      className={cn(
        "h-12 glass-card border-t border-neon-blue/20 px-6",
        className
      )}
      data-zlayer={`bottombar (z: var(--z-footer))`}
    >
      <div className="h-full flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={handleAnalyticsClick}
            className={cn(
              "text-neon-pink hover:text-neon-blue transition-colors",
              showAnalytics && "text-neon-blue",
              hasNewActivity && "animate-pulse"
            )}
            data-zlayer={`analytics-toggle (z: var(--z-footer))`}
          >
            <Bug className="w-5 h-5" />
          </Button>

          <Button
            variant="ghost"
            size="icon"
            onClick={handleZDebugClick}
            className={cn(
              "text-neon-pink hover:text-neon-blue transition-colors",
              showZDebug && "text-neon-blue"
            )}
            data-zlayer={`zdebug-toggle (z: var(--z-footer))`}
          >
            <Wrench className="w-5 h-5" />
          </Button>

          <Button
            variant="ghost"
            size="icon"
            onClick={handleMetricsClick}
            className={cn(
              "text-neon-pink hover:text-neon-blue transition-colors",
              showMetrics && "text-neon-blue",
              hasNewActivity && "animate-pulse"
            )}
            data-zlayer={`metrics-toggle (z: var(--z-footer))`}
          >
            <Activity className="w-5 h-5" />
          </Button>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-sm text-neon-pink">© 2024 wiredFRONT</span>
          <span className="text-sm text-neon-blue">v1.0.0</span>
        </div>
      </div>
      {showAnalytics && <CacheMetricsPanel />}
      {showMetrics && <DebugMetrics />}
    </footer>
  );
};
