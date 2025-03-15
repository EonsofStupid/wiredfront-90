
import React from "react";
import { CoreLayout } from "@/core/layout/CoreLayout";

interface MainLayoutProps {
  children: React.ReactNode;
}

/**
 * @name MainLayout
 * @description A wrapper around CoreLayout to maintain backward compatibility
 */
export const MainLayout = ({ children }: MainLayoutProps) => {
  return <CoreLayout>{children}</CoreLayout>;
};
