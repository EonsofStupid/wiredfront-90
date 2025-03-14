
import { LucideIcon } from "lucide-react";

export interface AdminNavItem {
  name: string;
  href: string;
  icon: React.ReactNode;
}

export interface AdminTopNavOverlayProps {
  className?: string;
}

export interface AdminMainNavGroupProps {
  isCollapsed: boolean;
}

export interface AdminNavToggleProps {
  isExtended: boolean;
  onToggle: () => void;
}

export interface AdminNavIconButtonProps {
  icon: LucideIcon;
  tooltip: string;
  route: string;
  className?: string;
  text?: string;
}

export interface UseAdminNavReturn {
  isExtended: boolean;
  adminIconOnly: boolean;
  toggleExtended: () => void;
}
