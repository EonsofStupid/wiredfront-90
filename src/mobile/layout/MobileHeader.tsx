
import React from "react";
import { Menu, Search, Bell } from "lucide-react";
import { Button } from "@/components/ui/button";
import { MobilePageTitle } from "./MobilePageTitle";
import { useMobileMenu } from "../hooks/useMobileMenu";

/**
 * Mobile-specific header component with menu toggle and actions
 */
export const MobileHeader = () => {
  const { toggleMenu } = useMobileMenu();

  return (
    <header className="fixed top-0 left-0 right-0 h-16 bg-dark-lighter/80 backdrop-blur-md border-b border-neon-blue/20 z-50">
      <div className="flex items-center justify-between px-4 h-full">
        <Button 
          variant="ghost" 
          size="icon"
          className="text-neon-pink hover:text-neon-blue"
          onClick={toggleMenu}
          aria-label="Open menu"
        >
          <Menu className="h-5 w-5" />
        </Button>

        <MobilePageTitle />

        <div className="flex items-center gap-2">
          <Button 
            variant="ghost" 
            size="icon"
            className="text-neon-pink hover:text-neon-blue"
            aria-label="Search"
          >
            <Search className="h-5 w-5" />
          </Button>
          <Button 
            variant="ghost" 
            size="icon"
            className="text-neon-pink hover:text-neon-blue"
            aria-label="Notifications"
          >
            <Bell className="h-5 w-5" />
          </Button>
        </div>
      </div>
    </header>
  );
};
