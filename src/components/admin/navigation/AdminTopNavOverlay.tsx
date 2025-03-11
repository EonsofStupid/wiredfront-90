
import React, { useState, useEffect } from "react";
import { 
  ChevronUp, ChevronDown, Settings, Database, Users, 
  LayoutDashboard, Search, Bell, Shield, Code, 
  MessageSquare, Eye, Activity, HardDrive, ListChecks, Flag
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { useNavigate, useLocation } from "react-router-dom";
import { 
  AdminTooltip, 
  AdminTooltipContent, 
  AdminTooltipProvider, 
  AdminTooltipTrigger 
} from "@/components/admin/ui/AdminTooltip";

interface AdminTopNavOverlayProps {
  className?: string;
}

export const AdminTopNavOverlay = ({ className }: AdminTopNavOverlayProps) => {
  const [isExtended, setIsExtended] = useState(true);
  const navigate = useNavigate();
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
              <AdminTooltipProvider>
                <AdminTooltip>
                  <AdminTooltipTrigger asChild>
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      className="admin-nav-icon"
                      onClick={() => navigate('/admin/metrics-overview')}
                    >
                      <LayoutDashboard className="h-5 w-5" />
                    </Button>
                  </AdminTooltipTrigger>
                  <AdminTooltipContent side="bottom">Metrics Overview</AdminTooltipContent>
                </AdminTooltip>
              </AdminTooltipProvider>

              <AdminTooltipProvider>
                <AdminTooltip>
                  <AdminTooltipTrigger asChild>
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      className="admin-nav-icon"
                      onClick={() => navigate('/admin/users')}
                    >
                      <Users className="h-5 w-5" />
                    </Button>
                  </AdminTooltipTrigger>
                  <AdminTooltipContent side="bottom">User Management</AdminTooltipContent>
                </AdminTooltip>
              </AdminTooltipProvider>

              <AdminTooltipProvider>
                <AdminTooltip>
                  <AdminTooltipTrigger asChild>
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      className="admin-nav-icon"
                      onClick={() => navigate('/admin/settings/general')}
                    >
                      <Settings className="h-5 w-5" />
                    </Button>
                  </AdminTooltipTrigger>
                  <AdminTooltipContent side="bottom">System Settings</AdminTooltipContent>
                </AdminTooltip>
              </AdminTooltipProvider>

              <AdminTooltipProvider>
                <AdminTooltip>
                  <AdminTooltipTrigger asChild>
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      className="admin-nav-icon"
                      onClick={() => navigate('/admin/database')}
                    >
                      <Database className="h-5 w-5" />
                    </Button>
                  </AdminTooltipTrigger>
                  <AdminTooltipContent side="bottom">Database</AdminTooltipContent>
                </AdminTooltip>
              </AdminTooltipProvider>

              <AdminTooltipProvider>
                <AdminTooltip>
                  <AdminTooltipTrigger asChild>
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      className="admin-nav-icon"
                      onClick={() => navigate('/admin/models')}
                    >
                      <Code className="h-5 w-5" />
                    </Button>
                  </AdminTooltipTrigger>
                  <AdminTooltipContent side="bottom">Models</AdminTooltipContent>
                </AdminTooltip>
              </AdminTooltipProvider>

              <AdminTooltipProvider>
                <AdminTooltip>
                  <AdminTooltipTrigger asChild>
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      className="admin-nav-icon"
                      onClick={() => navigate('/admin/activity')}
                    >
                      <Activity className="h-5 w-5" />
                    </Button>
                  </AdminTooltipTrigger>
                  <AdminTooltipContent side="bottom">Activity & Logs</AdminTooltipContent>
                </AdminTooltip>
              </AdminTooltipProvider>

              <AdminTooltipProvider>
                <AdminTooltip>
                  <AdminTooltipTrigger asChild>
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      className="admin-nav-icon"
                      onClick={() => navigate('/admin/settings/chat')}
                    >
                      <MessageSquare className="h-5 w-5" />
                    </Button>
                  </AdminTooltipTrigger>
                  <AdminTooltipContent side="bottom">Chat Settings</AdminTooltipContent>
                </AdminTooltip>
              </AdminTooltipProvider>

              <AdminTooltipProvider>
                <AdminTooltip>
                  <AdminTooltipTrigger asChild>
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      className="admin-nav-icon"
                      onClick={() => navigate('/admin/settings/feature-flags')}
                    >
                      <Flag className="h-5 w-5" />
                    </Button>
                  </AdminTooltipTrigger>
                  <AdminTooltipContent side="bottom">Feature Flags</AdminTooltipContent>
                </AdminTooltip>
              </AdminTooltipProvider>

              <AdminTooltipProvider>
                <AdminTooltip>
                  <AdminTooltipTrigger asChild>
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      className="admin-nav-icon"
                      onClick={() => navigate('/admin/queues')}
                    >
                      <ListChecks className="h-5 w-5" />
                    </Button>
                  </AdminTooltipTrigger>
                  <AdminTooltipContent side="bottom">Queues</AdminTooltipContent>
                </AdminTooltip>
              </AdminTooltipProvider>

              <AdminTooltipProvider>
                <AdminTooltip>
                  <AdminTooltipTrigger asChild>
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      className="admin-nav-icon"
                      onClick={() => navigate('/admin/cache')}
                    >
                      <HardDrive className="h-5 w-5" />
                    </Button>
                  </AdminTooltipTrigger>
                  <AdminTooltipContent side="bottom">Cache</AdminTooltipContent>
                </AdminTooltip>
              </AdminTooltipProvider>
            </div>

            {/* Right side controls */}
            <div className="flex items-center gap-2">
              <AdminTooltipProvider>
                <AdminTooltip>
                  <AdminTooltipTrigger asChild>
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      className="admin-nav-icon"
                      onClick={() => navigate('/admin/search')}
                    >
                      <Search className="h-5 w-5" />
                    </Button>
                  </AdminTooltipTrigger>
                  <AdminTooltipContent side="bottom">Search</AdminTooltipContent>
                </AdminTooltip>
              </AdminTooltipProvider>

              <AdminTooltipProvider>
                <AdminTooltip>
                  <AdminTooltipTrigger asChild>
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      className="admin-nav-icon"
                      onClick={() => navigate('/admin/notifications')}
                    >
                      <Bell className="h-5 w-5" />
                    </Button>
                  </AdminTooltipTrigger>
                  <AdminTooltipContent side="bottom">Notifications</AdminTooltipContent>
                </AdminTooltip>
              </AdminTooltipProvider>
            </div>
          </div>
        </div>

        <Button
          variant="ghost"
          size="sm"
          onClick={() => setIsExtended(!isExtended)}
          className={cn(
            "absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-[calc(100%-2px)]",
            "admin-nav-handle rounded-t-none rounded-b-lg",
            "border border-t-0 backdrop-blur-md",
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
