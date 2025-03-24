import { DebugPanel } from "@/components/debug/DebugPanel";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";
import { WebSocketLogger } from "@/services/chat/websocket/monitoring/WebSocketLogger";
import { Activity, Bug } from "lucide-react";
import { useEffect, useState } from "react";

interface BottomBarProps {
  className?: string;
}

export const BottomBar = ({ className }: BottomBarProps) => {
  const [showDebug, setShowDebug] = useState(false);
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

  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      // Toggle debug with Ctrl/Cmd + Shift + D
      if (
        (e.ctrlKey || e.metaKey) &&
        e.shiftKey &&
        e.key.toLowerCase() === "d"
      ) {
        e.preventDefault();
        setShowDebug((prev) => !prev);
        setHasNewActivity(false);
      }
    };

    window.addEventListener("keydown", handleKeyPress);
    return () => window.removeEventListener("keydown", handleKeyPress);
  }, []);

  const handleDebugClick = () => {
    setShowDebug(!showDebug);
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
          <TooltipProvider delayDuration={0}>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={handleDebugClick}
                  className={cn(
                    "text-neon-pink hover:text-neon-blue transition-colors",
                    showDebug && "text-neon-blue",
                    hasNewActivity && "animate-pulse"
                  )}
                  data-zlayer={`debug-toggle (z: var(--z-footer))`}
                >
                  <Bug className="w-5 h-5" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Toggle Debug Mode</p>
                <p className="text-xs text-gray-400">Ctrl/Cmd + Shift + D</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>

          <Button
            variant="ghost"
            size="icon"
            className={cn(
              "text-neon-pink hover:text-neon-blue transition-colors",
              hasNewActivity && "text-neon-blue animate-pulse"
            )}
          >
            <Activity className="w-5 h-5" />
          </Button>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-sm text-neon-pink">© 2024 wiredFRONT</span>
          <span className="text-sm text-neon-blue">v1.0.0</span>
        </div>
      </div>
      {showDebug && <DebugPanel />}
    </footer>
  );
};
