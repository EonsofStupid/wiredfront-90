
import React from "react";
import { 
  Home, 
  FileText, 
  Edit, 
  Settings, 
  Image, 
  Book, 
  BarChart2,
  ChevronRight,
  ChevronLeft,
  ShieldAlert
} from "lucide-react";
import { NavItem } from "./NavItem";
import { useLocation, useNavigate } from "react-router-dom";
import { cn } from "@/lib/utils";
import { useRoleStore } from "@/stores/role";

interface SidebarProps {
  side?: "left" | "right";
  isCompact: boolean;
  className?: string;
}

export const Sidebar = ({ side = "left", isCompact, className }: SidebarProps) => {
  const location = useLocation();
  const navigate = useNavigate();
  const { hasRole } = useRoleStore();
  const isAdmin = hasRole('admin') || hasRole('super_admin');
  
  return (
    <div
      className={cn(
        "glass-card border-neon-blue/20 transition-all duration-300 ease-in-out h-full relative",
        side === "left" ? "border-r" : "border-l",
        isCompact ? "w-20" : "w-32",
        className
      )}
    >
      <div className="flex flex-col items-center justify-between h-full py-4">
        <div className="w-full">
          <NavItem
            icon={Home}
            label="Dashboard"
            isActive={location.pathname === "/dashboard"}
            isCompact={isCompact}
            onClick={() => navigate("/dashboard")}
          />
          
          <NavItem
            icon={Edit}
            label="Editor"
            isActive={location.pathname === "/editor"}
            isCompact={isCompact}
            onClick={() => navigate("/editor")}
          />
          
          <NavItem
            icon={FileText}
            label="Documents"
            isActive={location.pathname === "/documents"}
            isCompact={isCompact}
            onClick={() => navigate("/documents")}
          />
          
          <NavItem
            icon={Image}
            label="Gallery"
            isActive={location.pathname === "/gallery"}
            isCompact={isCompact}
            onClick={() => navigate("/gallery")}
          />
          
          <NavItem
            icon={Book}
            label="Training"
            isActive={location.pathname === "/training"}
            isCompact={isCompact}
            onClick={() => navigate("/training")}
          />
          
          <NavItem
            icon={BarChart2}
            label="Analytics"
            isActive={location.pathname === "/analytics"}
            isCompact={isCompact}
            onClick={() => navigate("/analytics")}
          />
          
          {isAdmin && (
            <NavItem
              icon={ShieldAlert}
              label="Admin"
              isActive={location.pathname.startsWith("/admin")}
              isCompact={isCompact}
              onClick={() => navigate("/admin")}
              className="mt-2 text-purple-400"
            />
          )}
        </div>
        
        <div className="w-full mt-auto">
          <NavItem
            icon={Settings}
            label="Settings"
            isActive={location.pathname === "/settings"}
            isCompact={isCompact}
            onClick={() => navigate("/settings")}
          />
        </div>
      </div>
    </div>
  );
};
