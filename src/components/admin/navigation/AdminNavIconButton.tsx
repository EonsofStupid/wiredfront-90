
import React from "react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { LucideIcon } from "lucide-react";
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
}

export const AdminNavIconButton = ({
  icon: Icon,
  tooltip,
  route,
  className
}: AdminNavIconButtonProps) => {
  const navigate = useNavigate();

  return (
    <AdminTooltipProvider>
      <AdminTooltip>
        <AdminTooltipTrigger asChild>
          <Button 
            variant="ghost" 
            size="icon" 
            className="admin-nav-icon"
            onClick={() => navigate(route)}
          >
            <Icon className="h-5 w-5" />
          </Button>
        </AdminTooltipTrigger>
        <AdminTooltipContent side="bottom">{tooltip}</AdminTooltipContent>
      </AdminTooltip>
    </AdminTooltipProvider>
  );
};
