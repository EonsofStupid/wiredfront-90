
import React from "react";
import { 
  LayoutDashboard, 
  Users, 
  Settings, 
  Database, 
  Code 
} from "lucide-react";
import { AdminNavIconButton } from "./AdminNavIconButton";
import { useUIStore } from "@/stores/ui";

export const AdminMainNavGroup = () => {
  const { layout } = useUIStore();
  const { adminIconOnly } = layout;

  return (
    <div className={cn(
      "flex",
      adminIconOnly 
        ? "items-center space-x-1"
        : "flex-wrap items-center gap-2"
    )}>
      <AdminNavIconButton 
        icon={LayoutDashboard} 
        tooltip="Metrics Overview" 
        text="Dashboard"
        route="/admin/metrics-overview" 
      />
      <AdminNavIconButton 
        icon={Users} 
        tooltip="User Management" 
        text="Users"
        route="/admin/users" 
      />
      <AdminNavIconButton 
        icon={Settings} 
        tooltip="System Settings" 
        text="Settings"
        route="/admin/settings/general" 
      />
      <AdminNavIconButton 
        icon={Database} 
        tooltip="Database" 
        text="Database"
        route="/admin/database" 
      />
      <AdminNavIconButton 
        icon={Code} 
        tooltip="Models" 
        text="Models"
        route="/admin/models" 
      />
    </div>
  );
};

// Import cn utility at the top
import { cn } from "@/lib/utils";
