
import React from "react";
import { Button } from "@/components/ui/button";
import { useNavigate, useLocation } from "react-router-dom";
import { useUIStore } from "@/stores/ui";
import { cn } from "@/lib/utils";
import styles from "./styles/AdminNavStyles.module.css";
import { AdminNavIconButtonProps } from "./types";
import {
  AdminTooltip,
  AdminTooltipContent,
  AdminTooltipProvider,
  AdminTooltipTrigger
} from "@/components/admin/ui/AdminTooltip";

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
        styles.navIcon,
        isActive && styles.navIconActive,
        adminIconOnly ? styles.iconOnly : styles.withText,
        className
      )}
      onClick={() => navigate(route)}
      aria-label={tooltip}
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
