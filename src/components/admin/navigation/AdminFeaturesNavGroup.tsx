
import React from "react";
import { 
  Activity, 
  MessageSquare, 
  Flag, 
  ListChecks, 
  HardDrive 
} from "lucide-react";
import { AdminNavIconButton } from "./AdminNavIconButton";

export const AdminFeaturesNavGroup = () => {
  return (
    <>
      <AdminNavIconButton 
        icon={Activity} 
        tooltip="Activity & Logs" 
        route="/admin/activity" 
      />
      <AdminNavIconButton 
        icon={MessageSquare} 
        tooltip="Chat Settings" 
        route="/admin/settings/chat" 
      />
      <AdminNavIconButton 
        icon={Flag} 
        tooltip="Feature Flags" 
        route="/admin/settings/feature-flags" 
      />
      <AdminNavIconButton 
        icon={ListChecks} 
        tooltip="Queues" 
        route="/admin/queues" 
      />
      <AdminNavIconButton 
        icon={HardDrive} 
        tooltip="Cache" 
        route="/admin/cache" 
      />
    </>
  );
};
