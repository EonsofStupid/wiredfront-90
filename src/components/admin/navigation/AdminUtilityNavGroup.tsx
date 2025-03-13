
import React from "react";
import { Search, Bell, HelpCircle } from "lucide-react";
import { AdminNavIconButton } from "./AdminNavIconButton";
import { AdminViewToggle } from "./AdminViewToggle";

export const AdminUtilityNavGroup = () => {
  return (
    <div className="flex items-center space-x-1">
      <AdminNavIconButton 
        icon={Search} 
        tooltip="Search" 
        route="/admin/search" 
      />
      <AdminNavIconButton 
        icon={Bell} 
        tooltip="Notifications" 
        route="/admin/notifications" 
      />
      <AdminNavIconButton 
        icon={HelpCircle} 
        tooltip="Help" 
        route="/admin/help" 
      />
      <AdminViewToggle />
    </div>
  );
};
