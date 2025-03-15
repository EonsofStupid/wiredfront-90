
import React from "react";
import { useIsMobile } from "@/hooks/use-mobile";
import { MainLayout } from "./MainLayout";
import { MobileHeader } from "./mobile/MobileHeader";
import { MobileBottomNav } from "./mobile/MobileBottomNav";
import { cn } from "@/lib/utils";
import { CoreLayoutContainer } from "@/core/layout/CoreLayoutContainer";

interface MobileLayoutProps {
  children: React.ReactNode;
}

export const MobileLayout = ({ children }: MobileLayoutProps) => {
  const { isMobile, screenSize } = useIsMobile();

  if (!isMobile) {
    return <MainLayout>{children}</MainLayout>;
  }

  return (
    <CoreLayoutContainer>
      <MobileHeader />
      
      <main className={cn(
        "flex-1 transition-all duration-300 ease-in-out",
        "pt-16 pb-16", // Account for header and bottom nav
        "overflow-y-auto",
        // Add padding based on screen size
        screenSize === 'xs' ? 'px-4' : 'px-6'
      )}>
        {children}
      </main>

      <MobileBottomNav />
    </CoreLayoutContainer>
  );
};
