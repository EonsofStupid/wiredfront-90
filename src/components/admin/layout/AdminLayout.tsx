
import React from 'react';
import { AdminTopNavOverlay } from '@/components/admin/navigation/AdminTopNavOverlay';

interface AdminLayoutProps {
  children: React.ReactNode;
  fullWidth?: boolean;
}

export function AdminLayout({ children, fullWidth = false }: AdminLayoutProps) {
  return (
    <div className="min-h-screen">
      <AdminTopNavOverlay />
      <div className={`pt-16 p-6 ${fullWidth ? 'max-w-full' : 'max-w-7xl'} mx-auto`}>
        {children}
      </div>
    </div>
  );
}
