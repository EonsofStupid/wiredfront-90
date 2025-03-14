
import React from "react";
import { MobileHeader } from "./MobileHeader";
import { MobileBottomNav } from "./MobileBottomNav";
import { MobileMenuProvider } from "../providers/MobileMenuProvider";
import { useIsMobile } from "@/hooks/use-mobile";
import { cn } from "@/lib/utils";

interface MobileLayoutProps {
  children: React.ReactNode;
}

/**
 * The primary layout component for the mobile experience
 * Handles the structure of the mobile UI with header, content area, and bottom navigation
 */
export const MobileLayout = ({ children }: MobileLayoutProps) => {
  const { screenSize } = useIsMobile();
  
  return (
    <MobileMenuProvider>
      <div className="min-h-screen flex flex-col bg-background">
        <MobileHeader />
        
        <main className={cn(
          "flex-1 transition-all duration-300 ease-in-out",
          "pt-16 pb-16", // Account for header and bottom nav
          "overflow-y-auto",
          // Add padding based on screen size
          screenSize === 'xs' ? 'px-3' : 'px-4'
        )}>
          {children}
        </main>

        <MobileBottomNav />
      </div>
    </MobileMenuProvider>
  );
};
