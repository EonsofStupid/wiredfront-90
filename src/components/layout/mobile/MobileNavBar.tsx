import { Link, useLocation } from "react-router-dom";
import { Home, Code, FileText, Bot, Activity, Database, Settings } from "lucide-react";
import { cn } from "@/lib/utils";

export const MobileNavBar = () => {
  const location = useLocation();
  
  const navItems = [
    { icon: Home, label: "Home", path: "/" },
    { icon: Code, label: "Editor", path: "/editor" },
    { icon: FileText, label: "Documents", path: "/documents" },
    { icon: Bot, label: "AI Assistant", path: "/ai" },
    { icon: Activity, label: "Analytics", path: "/analytics" },
    { icon: Database, label: "Data", path: "/data" },
    { icon: Settings, label: "Settings", path: "/settings" },
  ];

  return (
    <nav className="h-full bg-dark-lighter p-4">
      <div className="space-y-2">
        {navItems.map((item) => {
          const isActive = location.pathname === item.path;
          return (
            <Link
              key={item.path}
              to={item.path}
              className={cn(
                "flex items-center gap-3 px-4 py-3 rounded-lg",
                "text-neon-pink hover:text-neon-blue transition-colors",
                "hover:bg-dark-lighter/30",
                isActive && "bg-dark-lighter/50 text-neon-blue"
              )}
            >
              <item.icon className="w-5 h-5" />
              <span className="text-sm">{item.label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
};