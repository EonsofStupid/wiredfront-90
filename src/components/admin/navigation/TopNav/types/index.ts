
import { LucideIcon } from "lucide-react";

export interface NavItem {
  name: string;
  href: string;
  icon: React.ReactNode;
}

export interface TopNavProps {
  className?: string;
}

export interface MainNavGroupProps {
  isCollapsed: boolean;
}

export interface NavToggleProps {
  isExtended: boolean;
  onToggle: () => void;
}

export interface NavIconButtonProps {
  icon: LucideIcon;
  tooltip: string;
  route: string;
  className?: string;
  text?: string;
}

export interface UseTopNavLayoutReturn {
  isExtended: boolean;
  iconOnly: boolean;
  toggleExtended: () => void;
}
