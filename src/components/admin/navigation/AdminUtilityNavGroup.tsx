
import React from "react";
import { Search, Bell, HelpCircle } from "lucide-react";
import { AdminNavIconButton } from "./AdminNavIconButton";
import { AdminViewToggle } from "./AdminViewToggle";
import { cn } from "@/lib/utils";
import { useUIStore } from "@/stores/ui";

export const AdminUtilityNavGroup = () => {
  const { layout } = useUIStore();
  const { adminIconOnly } = layout;

  return (
    <div className="flex items-center space-x-2">
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
