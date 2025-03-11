
import React, { useState, useEffect } from "react";
import { 
  ChevronUp, ChevronDown, Settings, Database, Users, 
  LayoutDashboard, Search, Bell, Shield, Code, 
  MessageSquare, Eye, Activity, HardDrive, ListChecks
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { useNavigate, useLocation } from "react-router-dom";

interface AdminTopNavOverlayProps {
  className?: string;
}

export const AdminTopNavOverlay = ({ className }: AdminTopNavOverlayProps) => {
  const [isExtended, setIsExtended] = useState(true);
  const [iconOnly, setIconOnly] = useState(false);
  const [activeTab, setActiveTab] = useState<string | null>(null);
  const navigate = useNavigate();
  const location = useLocation();

  // Auto-extend on page load and set active tab based on current path
  useEffect(() => {
    setIsExtended(true);
    
    // Set active tab based on current path
    const path = location.pathname;
    if (path.includes('/admin/settings/api')) setActiveTab('api');
    else if (path.includes('/admin/settings/general')) setActiveTab('general');
    else if (path.includes('/admin/settings/accessibility')) setActiveTab('accessibility');
    else if (path.includes('/admin/settings/notifications')) setActiveTab('notifications');
    else if (path.includes('/admin/settings/chat')) setActiveTab('chat');
    else if (path.includes('/admin/settings/chat-features')) setActiveTab('chat-features');
    else if (path.includes('/admin/settings/live-preview')) setActiveTab('live-preview');
    else setActiveTab(null);
  }, [location.pathname]);

  const handleNavigation = (path: string, tab: string | null = null) => {
    navigate(path);
    if (tab) setActiveTab(tab);
  };

  return (
    <div
      className={cn(
        "fixed top-0 left-0 right-0 transition-all duration-300 ease-in-out z-[var(--z-navbar)]",
        isExtended ? "translate-y-0" : "-translate-y-[calc(100%-0.75rem)]",
        className
      )}
    >
      <div className="admin-glass-panel border-neon-border relative">
        <div className="flex items-center justify-between px-4 py-2">
          {/* Left side - Admin quick controls */}
          <div className="flex items-center space-x-2">
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    className="admin-nav-icon"
                    onClick={() => handleNavigation('/admin')}
                  >
                    <LayoutDashboard className="h-5 w-5" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent className="admin-tooltip">Admin Dashboard</TooltipContent>
              </Tooltip>
            </TooltipProvider>

            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    className="admin-nav-icon"
                    onClick={() => handleNavigation('/admin/users')}
                  >
                    <Users className="h-5 w-5" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent className="admin-tooltip">User Management</TooltipContent>
              </Tooltip>
            </TooltipProvider>

            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    className="admin-nav-icon"
                    onClick={() => handleNavigation('/admin/settings/general')}
                  >
                    <Settings className="h-5 w-5" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent className="admin-tooltip">System Settings</TooltipContent>
              </Tooltip>
            </TooltipProvider>

            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    className="admin-nav-icon"
                    onClick={() => handleNavigation('/admin/database')}
                  >
                    <Database className="h-5 w-5" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent className="admin-tooltip">Database Management</TooltipContent>
              </Tooltip>
            </TooltipProvider>
            
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    className="admin-nav-icon"
                    onClick={() => handleNavigation('/admin/models')}
                  >
                    <Code className="h-5 w-5" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent className="admin-tooltip">Models Configuration</TooltipContent>
              </Tooltip>
            </TooltipProvider>
            
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    className="admin-nav-icon"
                    onClick={() => handleNavigation('/admin/activity')}
                  >
                    <Activity className="h-5 w-5" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent className="admin-tooltip">Activity & Logs</TooltipContent>
              </Tooltip>
            </TooltipProvider>

            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    className="admin-nav-icon"
                    onClick={() => handleNavigation('/admin/settings/chat')}
                  >
                    <MessageSquare className="h-5 w-5" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent className="admin-tooltip">Chat Settings</TooltipContent>
              </Tooltip>
            </TooltipProvider>
            
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    className="admin-nav-icon"
                    onClick={() => handleNavigation('/admin/settings/live-preview')}
                  >
                    <Eye className="h-5 w-5" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent className="admin-tooltip">Live Preview</TooltipContent>
              </Tooltip>
            </TooltipProvider>
            
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    className="admin-nav-icon"
                    onClick={() => handleNavigation('/admin/queues')}
                  >
                    <ListChecks className="h-5 w-5" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent className="admin-tooltip">Queue Management</TooltipContent>
              </Tooltip>
            </TooltipProvider>
            
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    className="admin-nav-icon"
                    onClick={() => handleNavigation('/admin/cache')}
                  >
                    <HardDrive className="h-5 w-5" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent className="admin-tooltip">Cache Control</TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>

          {/* Center - Admin navigation tabs (only shown when not in icon-only mode) */}
          {!iconOnly && (
            <div className="flex items-center space-x-3">
              <Button 
                variant="ghost" 
                className={cn(
                  "admin-nav-tab", 
                  activeTab === 'general' && "admin-nav-tab-active"
                )}
                onClick={() => handleNavigation('/admin/settings/general', 'general')}
              >
                General
              </Button>
              <Button 
                variant="ghost" 
                className={cn(
                  "admin-nav-tab", 
                  activeTab === 'api' && "admin-nav-tab-active"
                )}
                onClick={() => handleNavigation('/admin/settings/api', 'api')}
              >
                API
              </Button>
              <Button 
                variant="ghost" 
                className={cn(
                  "admin-nav-tab", 
                  activeTab === 'accessibility' && "admin-nav-tab-active"
                )}
                onClick={() => handleNavigation('/admin/settings/accessibility', 'accessibility')}
              >
                Accessibility
              </Button>
              <Button 
                variant="ghost" 
                className={cn(
                  "admin-nav-tab", 
                  activeTab === 'notifications' && "admin-nav-tab-active"
                )}
                onClick={() => handleNavigation('/admin/settings/notifications', 'notifications')}
              >
                Notifications
              </Button>
              <Button 
                variant="ghost" 
                className={cn(
                  "admin-nav-tab", 
                  activeTab === 'chat' && "admin-nav-tab-active"
                )}
                onClick={() => handleNavigation('/admin/settings/chat', 'chat')}
              >
                Chat
              </Button>
              <Button 
                variant="ghost" 
                className={cn(
                  "admin-nav-tab", 
                  activeTab === 'chat-features' && "admin-nav-tab-active"
                )}
                onClick={() => handleNavigation('/admin/settings/chat-features', 'chat-features')}
              >
                Chat Features
              </Button>
              <Button 
                variant="ghost" 
                className={cn(
                  "admin-nav-tab", 
                  activeTab === 'live-preview' && "admin-nav-tab-active"
                )}
                onClick={() => handleNavigation('/admin/settings/live-preview', 'live-preview')}
              >
                Live Preview
              </Button>
            </div>
          )}

          {/* Right side - Controls */}
          <div className="flex items-center space-x-2">
            <Button 
              variant="ghost" 
              size="icon" 
              className="admin-nav-icon"
              onClick={() => handleNavigation('/admin/search')}
            >
              <Search className="h-5 w-5" />
            </Button>
            <Button 
              variant="ghost" 
              size="icon" 
              className="admin-nav-icon"
              onClick={() => handleNavigation('/admin/notifications')}
            >
              <Bell className="h-5 w-5" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIconOnly(!iconOnly)}
              className="admin-nav-icon"
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
