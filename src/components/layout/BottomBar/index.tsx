import { cn } from "@/lib/utils";
import { Bug, Activity } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { WebSocketLogger } from '@/services/chat/websocket/monitoring/WebSocketLogger';

interface BottomBarProps {
  className?: string;
}

export const BottomBar = ({ className }: BottomBarProps) => {
  const [showDebug, setShowDebug] = useState(false);
  const [hasNewActivity, setHasNewActivity] = useState(false);

  const handleDebugClick = () => {
    setShowDebug(!showDebug);
    setHasNewActivity(false);
  };

  // Check for new activity every 5 seconds
  useState(() => {
    const interval = setInterval(() => {
      const logger = WebSocketLogger.getInstance();
      const recentLogs = logger.getLogs().filter(
        log => Date.now() - log.timestamp < 5000
      );
      setHasNewActivity(recentLogs.length > 0);
    }, 5000);
    return () => clearInterval(interval);
  });

  return (
    <footer className={cn("h-12 glass-card border-t border-neon-blue/20 px-6", className)}>
      <div className="h-full flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={handleDebugClick}
            className={cn(
              "text-neon-pink hover:text-neon-blue transition-colors",
              showDebug && "text-neon-blue"
            )}
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
          >
            <Activity className="w-5 h-5" />
          </Button>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-sm text-neon-pink">© 2024 wiredFRONT</span>
          <span className="text-sm text-neon-blue">v1.0.0</span>
        </div>
      </div>
    </footer>
  );
};