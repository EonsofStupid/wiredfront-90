
import React from "react";
import { 
  LayoutDashboard, 
  Users, 
  Settings, 
  Database, 
  KeyRound,
  MessageSquare,
  Github,
  FileCode,
  KanbanSquare,
  CreditCard,
  BarChart3,
  Layers
} from "lucide-react";
import { AdminNavIconButton } from "./AdminNavIconButton";
import { useUIStore } from "@/stores/ui";
import { cn } from "@/lib/utils";

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
        tooltip="Dashboard" 
        text="Dashboard"
        route="/admin/metrics-overview" 
      />
      <AdminNavIconButton 
        icon={Users} 
        tooltip="Customer Management" 
        text="Customers"
        route="/admin/customers" 
      />
      <AdminNavIconButton 
        icon={CreditCard} 
        tooltip="Subscription Management" 
        text="Subscriptions"
        route="/admin/subscriptions" 
      />
      <AdminNavIconButton 
        icon={Layers} 
        tooltip="Feature Management" 
        text="Features"
        route="/admin/feature-management" 
      />
      <AdminNavIconButton 
        icon={BarChart3} 
        tooltip="Usage Analytics" 
        text="Analytics"
        route="/admin/usage-analytics" 
      />
      <AdminNavIconButton 
        icon={Settings} 
        tooltip="System Settings" 
        text="Settings"
        route="/admin/settings/general" 
      />
      <AdminNavIconButton 
        icon={KeyRound} 
        tooltip="API Keys" 
        text="API Keys"
        route="/admin/api-keys" 
      />
      <AdminNavIconButton 
        icon={FileCode} 
        tooltip="Prompt Enhancements" 
        text="Prompts"
        route="/admin/prompt-enhancements" 
      />
      <AdminNavIconButton 
        icon={KanbanSquare} 
        tooltip="Project Management" 
        text="Projects"
        route="/admin/projects" 
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
};
