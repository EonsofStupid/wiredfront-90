
import React from "react";
import { Search, Bell } from "lucide-react";
import { AdminNavIconButton } from "./AdminNavIconButton";

export const AdminUtilityNavGroup = () => {
  return (
    <>
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
    </>
  );
};
