
import React from "react";
import { cn } from "@/lib/utils";
import { MainContentProps, LayoutDimensions } from "./types";

/**
 * @name CoreMainContent
 * @description The main content area component that adapts to sidebar states
 * DO NOT MODIFY THIS COMPONENT
 */
export function CoreMainContent({ 
  children, 
  className, 
  isLeftSidebarCompact, 
  isRightSidebarVisible 
}: MainContentProps) {
  return (
    <main 
      className={cn(
        "wf-core-main-content flex-1 transition-all duration-300 ease-in-out",
        className
      )}
      style={{
        marginLeft: isLeftSidebarCompact ? LayoutDimensions.compactLeftSidebarWidth : LayoutDimensions.expandedLeftSidebarWidth,
        marginRight: isRightSidebarVisible ? LayoutDimensions.rightSidebarWidth : '0',
      }}
      data-testid="core-main-content"
    >
      {children}
    </main>
  );
}
