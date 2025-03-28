
import React from "react";
import { cn } from "@/lib/utils";
import { SidebarProps, LayoutZIndex } from "./types";
import { Home, Code, FileText, Bot, Activity, Database, Image, GraduationCap } from "lucide-react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Link, useLocation } from "react-router-dom";

/**
 * @name CoreLeftSidebar
 * @description The left sidebar navigation component
 * DO NOT MODIFY THIS COMPONENT
 */
export function CoreLeftSidebar({ className, isCompact }: Omit<SidebarProps, 'side'>) {
  const location = useLocation();
  
  const navItems = [
    { icon: Home, label: "Home", path: "/" },
    { icon: Code, label: "Dev", path: "/editor" },
    { icon: FileText, label: "Documents", path: "/documents" },
    { icon: Bot, label: "AI Assistant", path: "/ai" },
    { icon: Activity, label: "Analytics", path: "/analytics" },
    { icon: Image, label: "Gallery", path: "/gallery" },
    { icon: GraduationCap, label: "Training", path: "/training" },
    { icon: Database, label: "Data", path: "/data" },
  ];

  return (
    <aside 
      className={cn(
        "wf-core-leftsidebar glass-card border-r border-neon-blue/20 transition-all duration-300 ease-in-out",
        isCompact ? "w-20" : "w-32",
        className
      )}
      style={{ zIndex: LayoutZIndex.navbar }}
      data-testid="core-leftsidebar"
    >
      <nav className="p-4 space-y-2">
        <TooltipProvider delayDuration={0}>
          {navItems.map((item) => {
            const isActive = location.pathname === item.path;
            
            return (
              <Tooltip key={item.path}>
                <TooltipTrigger asChild>
                  <Link to={item.path}>
                    <button
                      className={cn(
                        "w-full group flex items-center gap-3 px-3 py-2 rounded-lg",
                        "text-neon-pink hover:text-neon-blue transition-colors",
                        "hover:bg-dark-lighter/30",
                        "animate-hover-button focus:animate-hover-button",
                        "relative overflow-hidden",
                        isActive && "bg-dark-lighter/50 text-neon-blue"
                      )}
                      aria-label={item.label}
                    >
                      <item.icon className="w-6 h-6 shrink-0" />
                      {!isCompact && (
                        <span className="truncate text-sm">{item.label}</span>
                      )}
                      <div className="absolute inset-0 pointer-events-none">
                        <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity bg-gradient-to-r from-neon-blue/10 to-neon-pink/10" />
                      </div>
                    </button>
                  </Link>
                </TooltipTrigger>
                {isCompact && (
                  <TooltipContent side="right">
                    {item.label}
                  </TooltipContent>
                )}
              </Tooltip>
            );
          })}
        </TooltipProvider>
      </nav>
    </aside>
  );
}
