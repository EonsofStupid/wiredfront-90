import { cn } from "@/lib/utils";
import { Bell, Search, User, PanelLeftClose, PanelLeft } from "lucide-react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

interface TopBarProps {
  className?: string;
  isCompact: boolean;
  onToggleCompact: () => void;
}

export const TopBar = ({ className, isCompact, onToggleCompact }: TopBarProps) => {
  return (
    <header className={cn("h-16 border-b border-neon-blue/20 glass-card px-6", className)}>
      <div className="h-full flex items-center justify-between">
        <div className="flex items-center gap-4">
          <h1 className="gradient-text text-2xl font-bold">wiredFRONT</h1>
          <button
            onClick={onToggleCompact}
            className="animate-hover-button p-2 rounded-lg text-neon-pink hover:text-neon-blue transition-colors"
            aria-label={isCompact ? "Expand sidebar" : "Collapse sidebar"}
          >
            {isCompact ? <PanelLeft className="w-5 h-5" /> : <PanelLeftClose className="w-5 h-5" />}
          </button>
        </div>
        
        <TooltipProvider delayDuration={0}>
          <div className="flex items-center gap-4">
            <Tooltip>
              <TooltipTrigger asChild>
                <button className="animate-hover-button p-2 rounded-lg text-neon-pink hover:text-neon-blue transition-colors" aria-label="Search">
                  <Search className="w-5 h-5" />
                </button>
              </TooltipTrigger>
              <TooltipContent>Search</TooltipContent>
            </Tooltip>

            <Tooltip>
              <TooltipTrigger asChild>
                <button className="animate-hover-button p-2 rounded-lg text-neon-pink hover:text-neon-blue transition-colors" aria-label="Notifications">
                  <Bell className="w-5 h-5" />
                </button>
              </TooltipTrigger>
              <TooltipContent>Notifications</TooltipContent>
            </Tooltip>

            <Tooltip>
              <TooltipTrigger asChild>
                <button className="animate-hover-button p-2 rounded-lg text-neon-pink hover:text-neon-blue transition-colors" aria-label="Profile">
                  <User className="w-5 h-5" />
                </button>
              </TooltipTrigger>
              <TooltipContent>Profile</TooltipContent>
            </Tooltip>
          </div>
        </TooltipProvider>
      </div>
    </header>
  );
};