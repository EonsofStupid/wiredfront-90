import { Bell, Search, Settings } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "./ThemeToggle";

export function TopBar() {
  return (
    <header className="top-bar glass-card border-b border-border/20">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <h1 className="gradient-text text-2xl font-bold">wiredFRONT</h1>
        
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" className="text-foreground hover:text-primary">
            <Search className="w-5 h-5" />
          </Button>
          <Button variant="ghost" size="icon" className="text-foreground hover:text-primary">
            <Bell className="w-5 h-5" />
          </Button>
          <ThemeToggle />
          <Button variant="ghost" size="icon" className="text-foreground hover:text-primary">
            <Settings className="w-5 h-5" />
          </Button>
        </div>
      </div>
    </header>
  );
}