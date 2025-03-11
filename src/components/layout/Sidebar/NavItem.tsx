
import React from "react";
import { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface NavItemProps {
  icon: LucideIcon;
  label: string;
  isActive?: boolean;
  isCompact?: boolean;
  onClick?: () => void;
  className?: string;
}

export const NavItem = ({
  icon: Icon,
  label,
  isActive = false,
  isCompact = false,
  onClick,
  className,
}: NavItemProps) => {
  return (
    <div
      className={cn(
        "flex items-center justify-center w-full py-3 cursor-pointer transition-colors",
        isActive ? "text-primary bg-primary/10" : "text-muted-foreground hover:bg-accent/50 hover:text-primary",
        isCompact ? "px-0" : "px-4",
        className
      )}
      onClick={onClick}
    >
      <div className={cn("flex", isCompact ? "flex-col items-center" : "items-center")}>
        <Icon className={cn("", isCompact ? "h-5 w-5 mb-1" : "h-5 w-5 mr-2")} />
        <span className={cn("text-sm font-medium", isCompact && "text-xs")}>
          {label}
        </span>
      </div>
    </div>
  );
};
