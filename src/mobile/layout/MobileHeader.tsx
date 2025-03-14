
import React from "react";
import { Menu, Search, Bell } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useMobileMenu } from "../hooks/useMobileMenu";
import { MobilePageTitle } from "./MobilePageTitle";

/**
 * Mobile header component with menu button and page title
 */
export const MobileHeader = () => {
  const { toggleMenu } = useMobileMenu();
  
  return (
    <header className="mobile-header">
      <div className="flex items-center justify-between px-4 h-full">
        <Button 
          variant="ghost" 
          size="icon"
          className="text-neon-pink hover:text-neon-blue"
          onClick={toggleMenu}
        >
          <Menu className="h-5 w-5" />
        </Button>

        <MobilePageTitle />

        <div className="flex items-center gap-2">
          <Button 
            variant="ghost" 
            size="icon"
            className="text-neon-pink hover:text-neon-blue"
          >
            <Search className="h-5 w-5" />
          </Button>
          <Button 
            variant="ghost" 
            size="icon"
            className="text-neon-pink hover:text-neon-blue"
          >
            <Bell className="h-5 w-5" />
          </Button>
        </div>
      </div>
    </header>
  );
};
