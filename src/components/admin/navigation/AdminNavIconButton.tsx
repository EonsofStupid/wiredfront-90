
import React from "react";
import { Button } from "@/components/ui/button";
import { useNavigate, useLocation } from "react-router-dom";
import { LucideIcon } from "lucide-react";
import { useUIStore } from "@/stores/ui";
import { cn } from "@/lib/utils";
import {
  AdminTooltip,
  AdminTooltipContent,
  AdminTooltipProvider,
  AdminTooltipTrigger
} from "@/components/admin/ui/AdminTooltip";

interface AdminNavIconButtonProps {
  icon: LucideIcon;
  tooltip: string;
  route: string;
  className?: string;
  text?: string; // Optional text to display beside the icon
}

export const AdminNavIconButton = ({
  icon: Icon,
  tooltip,
  route,
  className,
  text
}: AdminNavIconButtonProps) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { layout } = useUIStore();
  const { adminIconOnly } = layout;
  
  // Check if this button's route is active
  const isActive = location.pathname === route || 
                   (route !== '/admin' && location.pathname.startsWith(route));

  // If in icon-only mode or no text is provided, show tooltip on hover
  const showTooltip = adminIconOnly || !text;
  
  // Use the text as tooltip when provided, otherwise use the passed tooltip
  const tooltipText = text || tooltip;

  const buttonContent = (
    <Button 
      variant="ghost" 
      size={adminIconOnly || !text ? "icon" : "sm"}
      className={cn(
        "admin-nav-icon transition-all",
        isActive && "admin-nav-icon-active",
        adminIconOnly ? "w-9 h-9 p-0" : "h-9 px-3",
        className
      )}
      onClick={() => navigate(route)}
    >
      <Icon className={cn("h-5 w-5", !adminIconOnly && text && "mr-2")} />
      {!adminIconOnly && text && <span className={isActive ? "text-white" : ""}>{text}</span>}
    </Button>
  );

  if (showTooltip) {
    return (
      <AdminTooltipProvider>
        <AdminTooltip>
          <AdminTooltipTrigger asChild>
            {buttonContent}
          </AdminTooltipTrigger>
          <AdminTooltipContent side="bottom">{tooltipText}</AdminTooltipContent>
        </AdminTooltip>
      </AdminTooltipProvider>
    );
  }

  return buttonContent;
};
