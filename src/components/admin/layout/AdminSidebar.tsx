import React from "react";
import { Link, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import { 
  Users, 
  Settings, 
  Database, 
  Activity,
  Queue,
  Cpu,
  Cache
} from "lucide-react";

const adminRoutes = [
  { path: "/admin/users", label: "Users", icon: Users },
  { path: "/admin/models", label: "Models", icon: Cpu },
  { path: "/admin/queues", label: "Queue Management", icon: Queue },
  { path: "/admin/cache", label: "Cache Control", icon: Cache },
  { path: "/admin/activity", label: "Activity Logs", icon: Activity },
  { path: "/admin/database", label: "Database", icon: Database },
  { path: "/admin/settings", label: "Settings", icon: Settings },
];

export function AdminSidebar() {
  const location = useLocation();

  return (
    <aside className="w-64 border-r border-border h-[calc(100vh-4rem)] p-4">
      <nav className="space-y-2">
        {adminRoutes.map((route) => (
          <Link
            key={route.path}
            to={route.path}
            className={cn(
              "flex items-center gap-3 px-3 py-2 rounded-lg transition-colors",
              "hover:bg-accent hover:text-accent-foreground",
              location.pathname === route.path ? "bg-accent text-accent-foreground" : "text-muted-foreground"
            )}
          >
            <route.icon className="h-4 w-4" />
            <span>{route.label}</span>
          </Link>
        ))}
      </nav>
    </aside>
  );
}