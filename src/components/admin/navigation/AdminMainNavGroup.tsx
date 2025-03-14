
import React from "react";
import { useLocation } from "react-router-dom";
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList
} from "@/components/ui/navigation-menu";
import { cn } from "@/lib/utils";
import { adminMainNavItems } from "./config/navItems";
import { AdminMainNavGroupProps } from "./types";
import styles from "./styles/AdminNavStyles.module.css";

export function AdminMainNavGroup({ isCollapsed }: AdminMainNavGroupProps) {
  const location = useLocation();

  return (
    <NavigationMenu className={styles.mainNavGroup}>
      <NavigationMenuList className={cn(
        "flex flex-wrap",
        isCollapsed ? "gap-1" : "gap-2 items-center"
      )}>
        {adminMainNavItems.map((item) => {
          const isActive = location.pathname === item.href || 
                         (item.href !== '/admin' && location.pathname.startsWith(item.href));

          return (
            <NavigationMenuItem key={item.name}>
              <NavigationMenuLink
                className={cn(
                  "group flex items-center rounded-md text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground",
                  isCollapsed ? styles.iconOnly : styles.withText,
                  isActive && styles.navIconActive
                )}
                href={item.href}
                asChild
              >
                <a className="flex items-center">
                  {item.icon}
                  {!isCollapsed && <span className={styles.navLabel}>{item.name}</span>}
                </a>
              </NavigationMenuLink>
            </NavigationMenuItem>
          );
        })}
      </NavigationMenuList>
    </NavigationMenu>
  );
}
