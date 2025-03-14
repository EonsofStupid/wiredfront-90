
import React from "react";
import { cn } from "@/lib/utils";
import { AdminMainNavGroup } from "./AdminMainNavGroup";
import { AdminUtilityNavGroup } from "./AdminUtilityNavGroup";
import { AdminNavToggle } from "./AdminNavToggle";
import { useUIStore } from "@/stores/ui";
import { AdminTopNavOverlayProps } from "./types";
import { useAdminNav } from "./hooks/useAdminNav";
import styles from "./styles/AdminNavStyles.module.css";

export const AdminTopNavOverlay = ({ className }: AdminTopNavOverlayProps) => {
  const { layout } = useUIStore();
  const { adminIconOnly } = layout;
  const { isExtended, toggleExtended } = useAdminNav();

  return (
    <div
      className={cn(
        styles.adminTopNav,
        isExtended ? styles.extended : styles.collapsed,
        className
      )}
    >
      <div className={styles.navPanel}>
        <div className={styles.navContent}>
          <div className={styles.navRow}>
            {/* Main navigation items that will flex-wrap as needed */}
            <AdminMainNavGroup isCollapsed={adminIconOnly} />
            
            {/* Utility group that will stay on the right */}
            <AdminUtilityNavGroup />
          </div>
        </div>

        <AdminNavToggle 
          isExtended={isExtended} 
          onToggle={toggleExtended} 
        />
      </div>
    </div>
  );
};
