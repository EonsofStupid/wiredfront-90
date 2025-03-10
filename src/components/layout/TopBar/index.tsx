
import { cn } from "@/lib/utils";
import { Menu, X, Info, ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { UserMenu } from "@/components/user/UserMenu";

interface TopBarProps {
  className?: string;
  isCompact: boolean;
  onToggleCompact: () => void;
  onToggleRightSidebar: () => void;
}

export const TopBar = ({ 
  className, 
  isCompact, 
  onToggleCompact,
  onToggleRightSidebar
}: TopBarProps) => {
  return (
    <div className={cn("glass-card border-b border-neon-blue/20 py-3 px-4", className)}>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={onToggleCompact}
            className="text-neon-pink hover:text-neon-blue"
          >
            {isCompact ? <Menu className="h-5 w-5" /> : <X className="h-5 w-5" />}
          </Button>
          
          <h1 className="text-xl font-semibold text-neon-blue">CodeCraft AI</h1>
        </div>
        
        <div className="flex items-center gap-3">
          <Button
            variant="ghost"
            size="icon"
            onClick={onToggleRightSidebar}
            className="text-neon-pink hover:text-neon-blue"
          >
            {isCompact ? <Info className="h-5 w-5" /> : 
              <div className="flex items-center">
                <span className="mr-2 text-sm">Projects</span>
                <ChevronRight className="h-4 w-4" />
              </div>
            }
          </Button>
          
          <UserMenu />
        </div>
      </div>
    </div>
  );
};
