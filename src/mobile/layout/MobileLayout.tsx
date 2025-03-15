
import React, { Suspense } from "react";
import { MobileHeader } from "./MobileHeader";
import { MobileBottomNav } from "./MobileBottomNav";
import { MobileMenuProvider } from "../providers/MobileMenuProvider";
import { useIsMobile } from "@/hooks/use-mobile";
import { cn } from "@/lib/utils";
import { CoreLayoutContainer } from "@/core/layout/CoreLayoutContainer";

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
      <CoreLayoutContainer>
        <MobileHeader />
        
        <main className={cn(
          "flex-1 transition-all duration-300 ease-in-out",
          "pt-16 pb-16", // Account for header and bottom nav
          "overflow-y-auto",
          // Add padding based on screen size
          screenSize === 'xs' ? 'px-3' : 'px-4'
        )}>
          <Suspense fallback={
            <div className="flex justify-center items-center py-12">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-neon-blue"></div>
            </div>
          }>
            {children}
          </Suspense>
        </main>

        <MobileBottomNav />
      </CoreLayoutContainer>
    </MobileMenuProvider>
  );
};
