
import React from "react";
import { AppLayout } from "./AppLayout";

interface MainLayoutProps {
  children: React.ReactNode;
}

/**
 * @name MainLayout
 * @description A simplified layout for the index page that ensures proper chat button visibility
 */
export const MainLayout = ({ children }: MainLayoutProps) => {
  return (
    <AppLayout>
      <div className="container mx-auto px-0 relative" style={{ zIndex: 500 }}>
        {children}
      </div>
    </AppLayout>
  );
};
