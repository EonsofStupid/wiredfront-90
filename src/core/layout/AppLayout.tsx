
import React, { ReactNode } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { useUIStore } from "@/stores";
import { withCoreLayout } from "@/core/layout/withCoreLayout";

interface AppLayoutProps {
  children: ReactNode;
}

/**
 * Base layout component that applies global UI elements
 * and determines whether to use the core layout or mobile layout
 */
export const AppLayout = ({ children }: AppLayoutProps) => {
  const theme = useUIStore((state) => state.theme);

  const LayoutWrapper = withCoreLayout(({ children }: { children: ReactNode }) => (
    <>{children}</>
  ));

  return (
    <div className={`min-h-screen bg-background ${theme}`}>
      <LayoutWrapper>
        {children}
      </LayoutWrapper>
      <Toaster />
      <Sonner />
    </div>
  );
};
