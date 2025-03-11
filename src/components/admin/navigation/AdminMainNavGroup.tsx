
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
    <>
      <AdminNavIconButton 
        icon={LayoutDashboard} 
        tooltip="Metrics Overview" 
        route="/admin" 
      />
      <AdminNavIconButton 
        icon={Users} 
        tooltip="User Management" 
        route="/admin/users" 
      />
      <AdminNavIconButton 
        icon={Settings} 
        tooltip="System Settings" 
        route="/admin/settings/general" 
      />
      <AdminNavIconButton 
        icon={Database} 
        tooltip="Database" 
        route="/admin/database" 
      />
      <AdminNavIconButton 
        icon={Code} 
        tooltip="Models" 
        route="/admin/models" 
      />
    </>
  );
};
