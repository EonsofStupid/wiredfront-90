import React from "react";
import { useIsMobile } from "@/hooks/use-mobile";
import { MainLayout } from "./MainLayout";
import { MobileNavBar } from "./mobile/MobileNavBar";
import { MobileHeader } from "./mobile/MobileHeader";
import { MobileBottomNav } from "./mobile/MobileBottomNav";

interface MobileLayoutProps {
  children: React.ReactNode;
}

export const MobileLayout = ({ children }: MobileLayoutProps) => {
  const isMobile = useIsMobile();

  if (!isMobile) {
    return <MainLayout>{children}</MainLayout>;
  }

  return (
    <div className="min-h-screen flex flex-col">
      <MobileHeader />
      <main className="flex-1 pt-16 pb-16 overflow-y-auto">
        {children}
      </main>
      <MobileBottomNav />
    </div>
  );
};