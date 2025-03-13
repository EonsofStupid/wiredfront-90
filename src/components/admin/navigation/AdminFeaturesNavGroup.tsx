
import React from "react";
import { 
  Database, 
  Github,
  KeyRound, 
  LayoutDashboard, 
  MessageSquare, 
  Settings, 
  UserCircle
} from "lucide-react";
import { AdminNavIconButton } from "./AdminNavIconButton";
import { useUIStore } from "@/stores/ui";
import { cn } from "@/lib/utils";

export default function AdminFeaturesNavGroup() {
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
        tooltip="Dashboard"
        text="Dashboard" 
        route="/admin" 
      />
      <AdminNavIconButton 
        icon={Settings} 
        tooltip="Settings"
        text="Settings" 
        route="/admin/settings" 
      />
      <AdminNavIconButton 
        icon={UserCircle} 
        tooltip="Users"
        text="Users" 
        route="/admin/users" 
      />
      <AdminNavIconButton 
        icon={KeyRound} 
        tooltip="API Keys"
        text="API Keys" 
        route="/admin/api-keys" 
      />
      <AdminNavIconButton 
        icon={MessageSquare} 
        tooltip="Chat Settings"
        text="Chat" 
        route="/admin/chat-settings" 
      />
      <AdminNavIconButton 
        icon={Database} 
        tooltip="Database"
        text="Database" 
        route="/admin/database" 
      />
      <AdminNavIconButton 
        icon={Github} 
        tooltip="GitHub Connections"
        text="GitHub" 
        route="/admin/github-connections" 
      />
    </div>
  );
}
