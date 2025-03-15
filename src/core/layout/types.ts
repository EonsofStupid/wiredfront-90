
import { ReactNode } from "react";

/**
 * @name CoreLayoutProps
 * @description Base props for all core layout components
 */
export interface CoreLayoutProps {
  className?: string;
  children?: ReactNode;
}

/**
 * @name SidebarProps
 * @description Props for sidebar components
 */
export interface SidebarProps extends CoreLayoutProps {
  side: "left" | "right";
  isCompact: boolean;
}

/**
 * @name TopBarProps
 * @description Props for the top navigation bar
 */
export interface TopBarProps extends CoreLayoutProps {
  isCompact: boolean;
  onToggleCompact: () => void;
}

/**
 * @name BottomBarProps
 * @description Props for the bottom status bar
 */
export interface BottomBarProps extends CoreLayoutProps {
  // Additional props specific to bottom bar can be added here
}

/**
 * @name MainContentProps
 * @description Props for the main content area
 */
export interface MainContentProps extends CoreLayoutProps {
  isLeftSidebarCompact: boolean;
  isRightSidebarVisible: boolean;
}

/**
 * @name LayoutZIndex
 * @description Z-index values for various layout components to maintain consistent layering
 */
export const LayoutZIndex = {
  userMenu: 9750,
  chat: 9700,
  projectHub: 9600,
  modal: 1000,
  dropdown: 900,
  tooltip: 800,
  navbar: 700,
  floating: 600,
  content: 500,
  background: 400,
  base: 300,
} as const;

/**
 * DO NOT MODIFY THESE VALUES
 * Core CSS variables that control layout dimensions
 */
export const LayoutDimensions = {
  topBarHeight: "4rem", // 64px
  expandedLeftSidebarWidth: "8rem", // 128px
  compactLeftSidebarWidth: "5rem", // 80px
  rightSidebarWidth: "16rem", // 256px
  bottomBarHeight: "3rem", // 48px
} as const;
