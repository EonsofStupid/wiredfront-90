
import React from 'react';
import { CoreLayout } from '@/core/layout/CoreLayout';

interface MainLayoutProps {
  children: React.ReactNode;
}

export const MainLayout = ({ children }: MainLayoutProps) => {
  return <CoreLayout>{children}</CoreLayout>;
};

export default MainLayout;
