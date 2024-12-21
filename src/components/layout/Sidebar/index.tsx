import { cn } from "@/lib/utils";
import { Home, Settings, Activity, Code, Database } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

interface SidebarProps {
  className?: string;
  side: "left" | "right";
}

export const Sidebar = ({ className, side }: SidebarProps) => {
  const navItems = side === "left" 
    ? [
        { icon: Home, label: "Home", path: "/" },
        { icon: Activity, label: "Analytics", path: "/analytics" },
        { icon: Code, label: "Editor", path: "/editor" },
      ]
    : [
        { icon: Database, label: "Data", path: "/data" },
        { icon: Settings, label: "Settings", path: "/settings" },
      ];

  return (
    <aside 
      className={cn(
        "w-16 glass-card border-neon-blue/20",
        side === "left" ? "border-r" : "border-l",
        className
      )}
    >
      <nav className="p-2 space-y-2">
        {navItems.map((item) => (
          <Link key={item.path} to={item.path}>
            <Button
              variant="ghost"
              className="w-full justify-center text-neon-pink hover:text-neon-blue"
              size="icon"
            >
              <item.icon className="w-5 h-5" />
              <span className="sr-only">{item.label}</span>
            </Button>
          </Link>
        ))}
      </nav>
    </aside>
  );
};