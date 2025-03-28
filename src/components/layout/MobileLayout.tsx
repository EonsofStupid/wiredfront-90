
import React from "react";
import { CoreLayout } from "@/core/layout/CoreLayout";

interface MobileLayoutProps {
  children: React.ReactNode;
}

/**
 * @name MobileLayout
 * @description A wrapper around CoreLayout to maintain backward compatibility
 */
export const MobileLayout = ({ children }: MobileLayoutProps) => {
  return <CoreLayout>{children}</CoreLayout>;
};
