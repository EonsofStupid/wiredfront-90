import { cn } from "@/lib/utils";
import { Bell, Search, PanelLeftClose, PanelLeft } from "lucide-react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { UserMenu } from "@/components/user/UserMenu";
import { Badge } from "@/components/ui/badge";

interface TopBarProps {
  className?: string;
  isCompact: boolean;
  onToggleCompact: () => void;
}

export const TopBar = ({ className, isCompact, onToggleCompact }: TopBarProps) => {
  const navigate = useNavigate();
  const isDev = process.env.NODE_ENV === 'development';

  return (
    <header className={cn("h-16 border-b border-neon-blue/20 glass-card px-6 relative z-40", className)}>
      <div className="h-full flex items-center justify-between">
        <div className="flex items-center gap-4">
          <h1 className="gradient-text text-2xl font-bold">wiredFRONT</h1>
          {isDev && (
            <Badge variant="secondary" className="bg-green-500/10 text-green-500 border-green-500/20">
              Development Mode
            </Badge>
          )}
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
                <Button 
                  variant="ghost" 
                  size="icon" 
                  onClick={() => navigate('/search')}
                  className="animate-hover-button text-neon-pink hover:text-neon-blue"
                >
                  <Search className="w-5 h-5" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>Search</TooltipContent>
            </Tooltip>

            <Tooltip>
              <TooltipTrigger asChild>
                <Button 
                  variant="ghost" 
                  size="icon"
                  onClick={() => navigate('/notifications')} 
                  className="animate-hover-button text-neon-pink hover:text-neon-blue"
                >
                  <Bell className="w-5 h-5" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>Notifications</TooltipContent>
            </Tooltip>

            <UserMenu />
          </div>
        </TooltipProvider>
      </div>
    </header>
  );
};