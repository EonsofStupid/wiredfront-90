
import React from "react";
import { LayoutGrid, List } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useUIStore } from "@/stores/ui";
import styles from "./styles/AdminNavStyles.module.css";
import {
  AdminTooltip,
  AdminTooltipContent,
  AdminTooltipProvider,
  AdminTooltipTrigger
} from "@/components/admin/ui/AdminTooltip";

export const AdminViewToggle = () => {
  const { layout, toggleAdminIconOnly } = useUIStore();
  const { adminIconOnly } = layout;

  return (
    <AdminTooltipProvider>
      <AdminTooltip>
        <AdminTooltipTrigger asChild>
          <Button
            variant="ghost"
            size="icon"
            onClick={toggleAdminIconOnly}
            className={styles.navIcon}
            aria-label={adminIconOnly ? "Show labels" : "Hide labels"}
          >
            {adminIconOnly ? (
              <List className="h-5 w-5" />
            ) : (
              <LayoutGrid className="h-5 w-5" />
            )}
          </Button>
        </AdminTooltipTrigger>
        <AdminTooltipContent side="bottom">
          {adminIconOnly ? "Show labels" : "Hide labels"}
        </AdminTooltipContent>
      </AdminTooltip>
    </AdminTooltipProvider>
  );
};
