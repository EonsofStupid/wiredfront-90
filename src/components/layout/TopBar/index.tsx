import { cn } from "@/lib/utils";
import { Bell, Search, User } from "lucide-react";
import { Button } from "@/components/ui/button";

interface TopBarProps {
  className?: string;
}

export const TopBar = ({ className }: TopBarProps) => {
  return (
    <header className={cn("h-16 border-b border-neon-blue/20 glass-card px-6", className)}>
      <div className="h-full flex items-center justify-between">
        <h1 className="gradient-text text-2xl font-bold">wiredFRONT</h1>
        
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" className="text-neon-pink hover:text-neon-blue">
            <Search className="w-5 h-5" />
          </Button>
          <Button variant="ghost" size="icon" className="text-neon-pink hover:text-neon-blue">
            <Bell className="w-5 h-5" />
          </Button>
          <Button variant="ghost" size="icon" className="text-neon-pink hover:text-neon-blue">
            <User className="w-5 h-5" />
          </Button>
        </div>
      </div>
    </header>
  );
};