
import { ReactNode } from "react";
import { ZIndex } from "@/styles/theme/zIndex";

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

// Use our centralized ZIndex definitions
export const LayoutZIndex = ZIndex;

export const LayoutDimensions = {
  expandedLeftSidebarWidth: '16rem', // 256px
  compactLeftSidebarWidth: '5rem',  // 80px
  rightSidebarWidth: '16rem',        // 256px
  topbarHeight: '4rem',              // 64px
  bottombarHeight: '3rem',           // 48px
};
