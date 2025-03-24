
import React from "react";
import { cn } from "@/lib/utils";
import { SidebarProps, LayoutZIndex } from "./types";
import { ProjectOverview } from "@/components/layout/Sidebar/ProjectOverview";

/**
 * @name CoreRightSidebar
 * @description The right sidebar for project overview
 * DO NOT MODIFY THIS COMPONENT
 */
export function CoreRightSidebar({ className, isCompact, isVisible }: Omit<SidebarProps, 'side'> & { isVisible: boolean }) {
  return (
    <div 
      className={cn(
        "wf-core-rightsidebar fixed right-0 top-16 bottom-12 glass-card border-l border-neon-blue/20 transition-all duration-300",
        isVisible ? "translate-x-0" : "translate-x-full",
        "w-64",
        className
      )}
      style={{ zIndex: LayoutZIndex.projecthub }}
      data-testid="core-rightsidebar"
    >
      <ProjectOverview isCompact={isCompact} className="h-full" />
    </div>
  );
}
