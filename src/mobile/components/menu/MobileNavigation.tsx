
import React from "react";
import { Link, useLocation } from "react-router-dom";
import { Home, Code, FileText, Bot, Activity, Database, Settings, BookOpen, Star, Users } from "lucide-react";
import { cn } from "@/lib/utils";

interface MobileNavigationProps {
  onItemClick?: () => void;
}

interface NavItem {
  icon: React.ElementType;
  label: string;
  path: string;
}

/**
 * Mobile navigation menu with navigation items
 */
export const MobileNavigation = ({ onItemClick }: MobileNavigationProps) => {
  const location = useLocation();
  
  const primaryNavItems: NavItem[] = [
    { icon: Home, label: "Home", path: "/" },
    { icon: Code, label: "Editor", path: "/editor" },
    { icon: FileText, label: "Documents", path: "/documents" },
    { icon: BookOpen, label: "Training", path: "/training" },
    { icon: Star, label: "Gallery", path: "/gallery" },
  ];

  const secondaryNavItems: NavItem[] = [
    { icon: Activity, label: "Analytics", path: "/analytics" },
    { icon: Bot, label: "AI Settings", path: "/ai-settings" },
    { icon: Database, label: "Projects", path: "/projects" },
    { icon: Users, label: "Team", path: "/team" },
    { icon: Settings, label: "Settings", path: "/settings" },
  ];

  const renderNavItems = (items: NavItem[]) => {
    return items.map((item) => {
      const isActive = location.pathname === item.path;
      return (
        <Link
          key={item.path}
          to={item.path}
          className={cn(
            "flex items-center gap-3 px-4 py-3 rounded-lg",
            "text-neon-pink hover:text-neon-blue transition-colors",
            "hover:bg-dark-lighter/30",
            isActive && "bg-dark-lighter/50 text-neon-blue"
          )}
          onClick={onItemClick}
        >
          <item.icon className="w-5 h-5" />
          <span>{item.label}</span>
        </Link>
      );
    });
  };

  return (
    <nav className="p-4">
      <div className="space-y-1">
        {renderNavItems(primaryNavItems)}
      </div>
      
      <div className="mt-8 pt-4 border-t border-neon-blue/10">
        <p className="px-4 text-xs uppercase text-neon-pink/60 mb-2">System</p>
        <div className="space-y-1">
          {renderNavItems(secondaryNavItems)}
        </div>
      </div>
    </nav>
  );
};
