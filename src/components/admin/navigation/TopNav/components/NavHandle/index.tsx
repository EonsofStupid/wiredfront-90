
import React from "react";
import { Button } from "@/components/ui/button";
import { ChevronUp, ChevronDown } from "lucide-react";
import { NavToggleProps } from "../../types";
import styles from "./styles.module.css";

export const NavHandle = ({ isExtended, onToggle }: NavToggleProps) => {
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
