import { Link, useLocation } from "react-router-dom";
import { Home, Code, Bot, Settings } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

export const MobileBottomNav = () => {
  const location = useLocation();
  
  const navItems = [
    { icon: Home, label: "Home", path: "/" },
    { icon: Code, label: "Editor", path: "/editor" },
    { icon: Settings, label: "Settings", path: "/settings" },
  ];

  const handleAIClick = () => {
    const chatElement = document.querySelector('[data-chat-window]');
    if (chatElement) {
      const isMinimized = chatElement.getAttribute('data-minimized') === 'true';
      if (isMinimized) {
        const event = new CustomEvent('chat-restore');
        window.dispatchEvent(event);
      }
    }
  };

  return (
    <nav className="fixed bottom-0 left-0 right-0 h-16 bg-dark-lighter/80 backdrop-blur-md border-t border-border">
      <div className="grid grid-cols-4 h-full">
        {navItems.map((item) => {
          const isActive = location.pathname === item.path;
          return (
            <Link
              key={item.path}
              to={item.path}
              className="flex flex-col items-center justify-center"
            >
              <div
                className={cn(
                  "flex flex-col items-center gap-1",
                  "text-neon-pink hover:text-neon-blue transition-colors",
                  isActive && "text-neon-blue"
                )}
              >
                <item.icon className="w-5 h-5" />
                <span className="text-xs">{item.label}</span>
              </div>
            </Link>
          );
        })}
        <Button
          variant="ghost"
          className="flex flex-col items-center justify-center w-full h-full"
          onClick={handleAIClick}
        >
          <div className="flex flex-col items-center gap-1 text-neon-pink hover:text-neon-blue transition-colors">
            <Bot className="w-5 h-5" />
            <span className="text-xs">AI</span>
          </div>
        </Button>
      </div>
    </nav>
  );
};