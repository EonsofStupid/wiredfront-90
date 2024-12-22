import { cn } from "@/lib/utils";
import { DebugMenuIcon } from "@/components/debug/DebugMenuIcon";

interface BottomBarProps {
  className?: string;
}

export const BottomBar = ({ className }: BottomBarProps) => {
  return (
    <footer className={cn("h-12 glass-card border-t border-neon-blue/20 px-6", className)}>
      <div className="h-full flex items-center justify-between">
        <div className="flex items-center gap-4">
          <DebugMenuIcon />
        </div>
        <span className="text-sm text-neon-pink">© 2024 wiredFRONT</span>
        <span className="text-sm text-neon-blue">v1.0.0</span>
      </div>
    </footer>
  );
};