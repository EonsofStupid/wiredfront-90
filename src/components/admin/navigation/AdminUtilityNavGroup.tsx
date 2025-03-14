
import React from "react";
import { Search, Bell, HelpCircle } from "lucide-react";
import { AdminNavIconButton } from "./AdminNavIconButton";
import { AdminViewToggle } from "./AdminViewToggle";
import styles from "./styles/AdminNavStyles.module.css";

export const AdminUtilityNavGroup = () => {
  return (
    <div className={styles.utilityNavGroup}>
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
