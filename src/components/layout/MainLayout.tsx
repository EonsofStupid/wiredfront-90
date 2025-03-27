
import React from "react";
import { CoreLayout } from "@/core/layout/CoreLayout";
import { useLocation } from "react-router-dom";

interface MainLayoutProps {
  children: React.ReactNode;
}

/**
 * @name MainLayout
 * @description A wrapper around CoreLayout to maintain backward compatibility
 */
export const MainLayout = ({ children }: MainLayoutProps) => {
  const location = useLocation();
  const isAdminRoute = location.pathname.startsWith('/admin');

  return <CoreLayout>{children}</CoreLayout>;
};
