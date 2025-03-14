
import React from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { LayoutGrid, List } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useUIStore } from "@/stores/ui";
import { utilityNavItems } from "../../constants/navConfig";
import styles from "./styles.module.css";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger
} from "@/components/ui/tooltip";

export const UtilityNavGroup = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { layout, toggleAdminIconOnly } = useUIStore();
  const { adminIconOnly } = layout;

  return (
    <div className={styles.utilityNavGroup}>
      {utilityNavItems.map((item) => {
        const isActive = location.pathname === item.href || 
                       (item.href !== '/admin' && location.pathname.startsWith(item.href));

        return (
          <TooltipProvider key={item.name}>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => navigate(item.href)}
                  className={`${styles.navIcon} ${isActive ? styles.navIconActive : ''}`}
                  aria-label={item.name}
                >
                  {item.icon}
                </Button>
              </TooltipTrigger>
              <TooltipContent side="bottom" className="admin-tooltip">{item.name}</TooltipContent>
            </Tooltip>
          </TooltipProvider>
        );
      })}

      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
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
          </TooltipTrigger>
          <TooltipContent side="bottom" className="admin-tooltip">
            {adminIconOnly ? "Show labels" : "Hide labels"}
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    </div>
  );
};
