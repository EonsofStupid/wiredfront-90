import React, { useState, useEffect } from "react";
import { ChevronUp, ChevronDown, Github, FolderGit2, Key, Search, Bell } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

interface ExtendableTopNavProps {
  className?: string;
}

export const ExtendableTopNav = ({ className }: ExtendableTopNavProps) => {
  const [isExtended, setIsExtended] = useState(true);
  const [iconOnly, setIconOnly] = useState(false);
  const [isGithubAuthenticated, setIsGithubAuthenticated] = useState(false);

  // Auto-extend on page load
  useEffect(() => {
    setIsExtended(true);
  }, []);

  const handleGithubAuth = async () => {
    const clientId = process.env.NEXT_PUBLIC_GITHUB_CLIENT_ID;
    if (!clientId) {
      console.error('GitHub Client ID is not configured');
      return;
    }

    const scope = 'repo'; // Permissions for repository access
    const redirectUri = `${window.location.origin}/api/github/callback`;
    
    const authUrl = `https://github.com/login/oauth/authorize?` +
      `client_id=${clientId}&` +
      `redirect_uri=${encodeURIComponent(redirectUri)}&` +
      `scope=${scope}`;

    window.location.href = authUrl;
  };

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
          {/* Left side - GitHub related controls */}
          <div className="flex items-center space-x-4">
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    className={cn(
                      "transition-colors",
                      isGithubAuthenticated 
                        ? "text-neon-green hover:text-neon-pink" 
                        : "text-neon-blue hover:text-neon-pink"
                    )}
                    onClick={handleGithubAuth}
                  >
                    <Github className="h-5 w-5" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  {isGithubAuthenticated ? 'Connected to GitHub' : 'Connect GitHub'}
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>

            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button variant="ghost" size="icon" className="text-neon-blue hover:text-neon-pink">
                    <FolderGit2 className="h-5 w-5" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>Repositories</TooltipContent>
              </Tooltip>
            </TooltipProvider>

            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button variant="ghost" size="icon" className="text-neon-blue hover:text-neon-pink">
                    <Key className="h-5 w-5" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>Personal Access Token</TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>

          {/* Center - Navigation tabs (only shown when not in icon-only mode) */}
          {!iconOnly && (
            <div className="flex items-center space-x-6">
              <Button 
                variant="ghost" 
                className="text-foreground hover:text-neon-pink transition-colors"
              >
                Files
              </Button>
              <Button 
                variant="ghost" 
                className="text-foreground hover:text-neon-pink transition-colors"
              >
                Images
              </Button>
              <Button 
                variant="ghost" 
                className="text-foreground hover:text-neon-pink transition-colors"
              >
                Projects
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