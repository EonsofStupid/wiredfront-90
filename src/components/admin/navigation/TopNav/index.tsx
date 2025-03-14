
import React from "react";
import { cn } from "@/lib/utils";
import { MainNavGroup } from "./components/MainNavGroup";
import { UtilityNavGroup } from "./components/UtilityNavGroup";
import { NavHandle } from "./components/NavHandle";
import { useTopNavLayout } from "./hooks/useTopNavLayout";
import { TopNavProps } from "./types";
import styles from "./styles.module.css";

export const AdminTopNav = ({ className }: TopNavProps) => {
  const { isExtended, iconOnly, toggleExtended } = useTopNavLayout();

  return (
    <div
      className={cn(
        styles.topNav,
        isExtended ? styles.extended : styles.collapsed,
        className
      )}
    >
      <div className={styles.navPanel}>
        <div className={styles.navContent}>
          <MainNavGroup isCollapsed={iconOnly} />
          <UtilityNavGroup />
        </div>

        <NavHandle 
          isExtended={isExtended} 
          onToggle={toggleExtended} 
        />
      </div>
    </div>
  );
};
