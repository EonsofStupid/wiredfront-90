
import React from "react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { LucideIcon } from "lucide-react";
import { useUIStore } from "@/stores/ui";
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
  const { layout } = useUIStore();
  const { adminIconOnly } = layout;

  // If in icon-only mode or no text is provided, show tooltip on hover
  const showTooltip = adminIconOnly || !text;
  
  // Use the text as tooltip when provided, otherwise use the passed tooltip
  const tooltipText = text || tooltip;

  const buttonContent = (
    <Button 
      variant="ghost" 
      size={adminIconOnly || !text ? "icon" : "sm"}
      className={`admin-nav-icon ${className || ""}`}
      onClick={() => navigate(route)}
    >
      <Icon className="h-5 w-5" />
      {!adminIconOnly && text && <span className="ml-2">{text}</span>}
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
