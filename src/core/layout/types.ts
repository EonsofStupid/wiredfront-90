
import { ReactNode } from "react";

export interface CoreLayoutProps {
  children?: ReactNode;
  className?: string;
}

export interface SidebarProps extends CoreLayoutProps {
  side?: 'left' | 'right';
  isCompact?: boolean;
}

export interface TopBarProps extends CoreLayoutProps {
  isCompact?: boolean;
  onToggleCompact?: () => void;
}

export interface BottomBarProps extends CoreLayoutProps {}

export interface MainContentProps extends CoreLayoutProps {
  isLeftSidebarCompact: boolean;
  isRightSidebarVisible: boolean;
}

// Using our new z-index variables from Chat-Zlayer.css
export enum LayoutZIndex {
  base = 0,
  content = 10,
  navbar = 50,
  sidebar = 40,
  dropdown = 100,
  modal = 200,
  toast = 300,
  tooltip = 400,
  projectHub = 30,
  userMenu = 60,
}

export const LayoutDimensions = {
  expandedLeftSidebarWidth: '16rem', // 256px
  compactLeftSidebarWidth: '5rem',  // 80px
  rightSidebarWidth: '16rem',        // 256px
  topbarHeight: '4rem',              // 64px
  bottombarHeight: '3rem',           // 48px
};
