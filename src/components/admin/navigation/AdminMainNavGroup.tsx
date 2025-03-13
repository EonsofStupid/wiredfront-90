
import React from "react";
import { 
  LayoutDashboard, 
  Users, 
  Settings, 
  Database, 
  Code 
} from "lucide-react";
import { AdminNavIconButton } from "./AdminNavIconButton";

export const AdminMainNavGroup = () => {
  return (
    <div className="flex items-center space-x-1">
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
