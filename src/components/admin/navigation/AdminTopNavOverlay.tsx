
import React, { useState, useEffect } from "react";
import { ChevronUp, ChevronDown, Settings, Database, Users, LayoutDashboard, Search, Bell } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { useNavigate } from "react-router-dom";

interface AdminTopNavOverlayProps {
  className?: string;
}

export const AdminTopNavOverlay = ({ className }: AdminTopNavOverlayProps) => {
  const [isExtended, setIsExtended] = useState(true);
  const [iconOnly, setIconOnly] = useState(false);
  const navigate = useNavigate();

  // Auto-extend on page load
  useEffect(() => {
    setIsExtended(true);
  }, []);

  return (
    <div
      className={cn(
        "fixed top-0 left-0 right-0 transition-all duration-300 ease-in-out z-[var(--z-navbar)]",
        isExtended ? "translate-y-0" : "-translate-y-[calc(100%-0.75rem)]",
        className
      )}
    >
      <div className="glass-card border-neon-border relative">
        <div className="flex items-center justify-between px-4 py-2">
          {/* Left side - Admin quick controls */}
          <div className="flex items-center space-x-4">
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    className="text-neon-blue hover:text-neon-pink transition-colors"
                    onClick={() => navigate('/admin')}
                  >
                    <LayoutDashboard className="h-5 w-5" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>Admin Dashboard</TooltipContent>
              </Tooltip>
            </TooltipProvider>

            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    className="text-neon-blue hover:text-neon-pink transition-colors"
                    onClick={() => navigate('/admin/users')}
                  >
                    <Users className="h-5 w-5" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>User Management</TooltipContent>
              </Tooltip>
            </TooltipProvider>

            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    className="text-neon-blue hover:text-neon-pink transition-colors"
                    onClick={() => navigate('/admin/settings/general')}
                  >
                    <Settings className="h-5 w-5" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>System Settings</TooltipContent>
              </Tooltip>
            </TooltipProvider>

            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    className="text-neon-blue hover:text-neon-pink transition-colors"
                    onClick={() => navigate('/admin/database')}
                  >
                    <Database className="h-5 w-5" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>Database Management</TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>

          {/* Center - Admin navigation tabs (only shown when not in icon-only mode) */}
          {!iconOnly && (
            <div className="flex items-center space-x-6">
              <Button 
                variant="ghost" 
                className="text-foreground hover:text-neon-pink transition-colors"
                onClick={() => navigate('/admin/settings/general')}
              >
                General
              </Button>
              <Button 
                variant="ghost" 
                className="text-foreground hover:text-neon-pink transition-colors"
                onClick={() => navigate('/admin/settings/api')}
              >
                API
              </Button>
              <Button 
                variant="ghost" 
                className="text-foreground hover:text-neon-pink transition-colors"
                onClick={() => navigate('/admin/settings/accessibility')}
              >
                Accessibility
              </Button>
              <Button 
                variant="ghost" 
                className="text-foreground hover:text-neon-pink transition-colors"
                onClick={() => navigate('/admin/settings/notifications')}
              >
                Notifications
              </Button>
            </div>
          )}

          {/* Right side - Controls */}
          <div className="flex items-center space-x-2">
            <Button variant="ghost" size="icon" className="text-neon-blue hover:text-neon-pink">
              <Search className="h-5 w-5" />
            </Button>
            <Button variant="ghost" size="icon" className="text-neon-blue hover:text-neon-pink">
              <Bell className="h-5 w-5" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIconOnly(!iconOnly)}
              className="text-neon-blue hover:text-neon-pink"
            >
              {iconOnly ? (
                <ChevronDown className="h-5 w-5" />
              ) : (
                <ChevronUp className="h-5 w-5" />
              )}
            </Button>
          </div>
        </div>

        {/* Slide control handle */}
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setIsExtended(!isExtended)}
          className={cn(
            "absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-[calc(100%-2px)]",
            "text-neon-blue hover:text-neon-pink rounded-t-none rounded-b-lg",
            "border border-t-0 border-white/10 bg-dark-lighter/30 backdrop-blur-md",
            "w-12 h-6 p-0 flex items-center justify-center"
          )}
        >
          {isExtended ? (
            <ChevronUp className="h-4 w-4" />
          ) : (
            <ChevronDown className="h-4 w-4" />
          )}
        </Button>
      </div>
    </div>
  );
};
