
import React, { useState, useEffect } from "react";
import { cn } from "@/lib/utils";
import { useLocation } from "react-router-dom";
import { AdminMainNavGroup } from "./AdminMainNavGroup";
import { AdminFeaturesNavGroup } from "./AdminFeaturesNavGroup";
import { AdminUtilityNavGroup } from "./AdminUtilityNavGroup";
import { AdminNavToggle } from "./AdminNavToggle";

interface AdminTopNavOverlayProps {
  className?: string;
}

export const AdminTopNavOverlay = ({ className }: AdminTopNavOverlayProps) => {
  const [isExtended, setIsExtended] = useState(true);
  const location = useLocation();

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
          <div className="flex justify-between items-start">
            <div className="flex flex-wrap items-center gap-2">
              <AdminMainNavGroup />
              <AdminFeaturesNavGroup />
            </div>

            {/* Right side controls */}
            <div className="flex items-center gap-2">
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
