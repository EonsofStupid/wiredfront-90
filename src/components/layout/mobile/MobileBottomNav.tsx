import { Link, useLocation } from "react-router-dom";
import { Home, Code, Bot, Settings } from "lucide-react";
import { cn } from "@/lib/utils";

export const MobileBottomNav = () => {
  const location = useLocation();
  
  const navItems = [
    { icon: Home, label: "Home", path: "/" },
    { icon: Code, label: "Editor", path: "/editor" },
    { icon: Bot, label: "AI", path: "/ai" },
    { icon: Settings, label: "Settings", path: "/settings" },
  ];

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
      </div>
    </nav>
  );
};