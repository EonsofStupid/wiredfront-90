import { cn } from "@/lib/utils";
import { Home, Settings, Activity, Code, Database } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

interface SidebarProps {
  className?: string;
}

export const Sidebar = ({ className }: SidebarProps) => {
  const navItems = [
    { icon: Home, label: "Home", path: "/" },
    { icon: Activity, label: "Analytics", path: "/analytics" },
    { icon: Code, label: "Editor", path: "/editor" },
    { icon: Database, label: "Data", path: "/data" },
    { icon: Settings, label: "Settings", path: "/settings" },
  ];

  return (
    <aside className={cn("w-64 glass-card border-r border-neon-blue/20", className)}>
      <nav className="p-4 space-y-2">
        {navItems.map((item) => (
          <Link key={item.path} to={item.path}>
            <Button
              variant="ghost"
              className="w-full justify-start gap-2 text-neon-pink hover:text-neon-blue"
            >
              <item.icon className="w-5 h-5" />
              {item.label}
            </Button>
          </Link>
        ))}
      </nav>
    </aside>
  );
};