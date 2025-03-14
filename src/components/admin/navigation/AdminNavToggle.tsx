
import React from "react";
import { Button } from "@/components/ui/button";
import { ChevronUp, ChevronDown } from "lucide-react";
import { AdminNavToggleProps } from "./types";
import styles from "./styles/AdminNavStyles.module.css";

export const AdminNavToggle = ({ isExtended, onToggle }: AdminNavToggleProps) => {
  return (
    <Button
      variant="ghost"
      size="sm"
      onClick={onToggle}
      className={styles.navHandle}
      aria-label={isExtended ? "Collapse navigation" : "Expand navigation"}
    >
      {isExtended ? (
        <ChevronUp className="h-4 w-4" />
      ) : (
        <ChevronDown className="h-4 w-4" />
      )}
    </Button>
  );
};
