
import React, { useState, useEffect } from "react";
import { cn } from "@/lib/utils";
import { useLocation } from "react-router-dom";
import { AdminMainNavGroup } from "./AdminMainNavGroup";
import { AdminUtilityNavGroup } from "./AdminUtilityNavGroup";
import { AdminNavToggle } from "./AdminNavToggle";
import { useUIStore } from "@/stores/ui";

interface AdminTopNavOverlayProps {
  className?: string;
}

export const AdminTopNavOverlay = ({ className }: AdminTopNavOverlayProps) => {
  const [isExtended, setIsExtended] = useState(true);
  const location = useLocation();
  const { layout } = useUIStore();
  const { adminIconOnly } = layout;

  useEffect(() => {
    setIsExtended(true);
  }, [location.pathname]);

  return (
    <div
      className={cn(
        "fixed top-0 left-0 right-0 transition-all duration-300 ease-in-out z-[var(--z-navbar)]",
        isExtended ? "translate-y-0" : "-translate-y-[calc(100%-0.75rem)]",
        className
      )}
    >
      <div className="admin-glass-panel border-neon-border relative">
        <div className="flex flex-col h-full p-4">
          {/* Single row with main nav on left and utility nav on right */}
          <div className="flex items-center justify-between w-full">
            {/* Left side - Main navigation */}
            <AdminMainNavGroup isCollapsed={adminIconOnly} />

            {/* Right side - Utility navigation */}
            <div className="flex-shrink-0">
              <AdminUtilityNavGroup />
            </div>
          </div>
        </div>

        <AdminNavToggle 
          isExtended={isExtended} 
          onToggle={() => setIsExtended(!isExtended)} 
        />
      </div>
    </div>
  );
};
