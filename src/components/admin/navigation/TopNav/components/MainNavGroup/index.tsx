
import React from "react";
import { useLocation } from "react-router-dom";
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList
} from "@/components/ui/navigation-menu";
import { cn } from "@/lib/utils";
import { mainNavItems } from "../../constants/navConfig";
import { MainNavGroupProps } from "../../types";
import styles from "./styles.module.css";

export function MainNavGroup({ isCollapsed }: MainNavGroupProps) {
  const location = useLocation();

  return (
    <NavigationMenu className={styles.mainNavGroup}>
      <NavigationMenuList className={cn(
        "flex flex-wrap",
        isCollapsed ? "gap-1" : "gap-2 items-center"
      )}>
        {mainNavItems.map((item) => {
          const isActive = location.pathname === item.href || 
                         (item.href !== '/admin' && location.pathname.startsWith(item.href));

          return (
            <NavigationMenuItem key={item.name}>
              <NavigationMenuLink
                className={cn(
                  "group flex items-center rounded-md text-sm font-medium transition-colors",
                  isCollapsed ? styles.navItemIconOnly : styles.navItemWithText,
                  isActive && styles.navItemActive
                )}
                href={item.href}
                asChild
              >
                <a className="flex items-center">
                  <span className={styles.navItemIcon}>{item.icon}</span>
                  {!isCollapsed && <span className={styles.navItemLabel}>{item.name}</span>}
                </a>
              </NavigationMenuLink>
            </NavigationMenuItem>
          );
        })}
      </NavigationMenuList>
    </NavigationMenu>
  );
}
