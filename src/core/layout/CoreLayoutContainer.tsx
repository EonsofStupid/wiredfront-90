
import React from "react";
import { cn } from "@/lib/utils";
import { CoreLayoutProps } from "./types";
import "./styles/core-layout.css";

/**
 * @name CoreLayoutContainer
 * @description The root container for the application layout
 * This component should wrap the entire application layout
 * DO NOT MODIFY THIS COMPONENT
 */
export function CoreLayoutContainer({ children, className }: CoreLayoutProps) {
  return (
    <div 
      className={cn(
        "wf-core-layout-container min-h-screen w-full bg-background",
        className
      )}
      data-testid="core-layout-container"
    >
      {children}
    </div>
  );
}
