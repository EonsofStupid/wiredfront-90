import { Button } from "@/components/ui/button";
import { File, Settings, Image, Bot, Menu, Search, Bell, User } from "lucide-react";

export const TopBar = () => {
  return (
    <div className="h-16 glass-card border-b border-white/10 flex items-center justify-between px-4">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon">
          <Menu className="h-5 w-5" />
        </Button>
        <span className="text-lg font-semibold gradient-text">wiredFRONT</span>
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon">
            <File className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="icon">
            <Bot className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="icon">
            <Image className="h-4 w-4" />
          </Button>
        </div>
      </div>
      
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon">
          <Search className="h-5 w-5" />
        </Button>
        <Button variant="ghost" size="icon">
          <Bell className="h-5 w-5" />
        </Button>
        <Button variant="ghost" size="icon">
          <User className="h-5 w-5" />
        </Button>
        <Button variant="ghost" size="icon">
          <Settings className="h-5 w-5" />
        </Button>
      </div>
    </div>
  );
};