
import React from "react";
import AdminSidebar from "./AdminSidebar";
import { AdminHeader } from "./AdminHeader";
import { AdminRoleCheck } from "@/components/auth/AdminRoleCheck";

interface AdminLayoutProps {
  children: React.ReactNode;
}

export function AdminLayout({ children }: AdminLayoutProps) {
  return (
    <AdminRoleCheck>
      <div className="min-h-screen bg-background">
        <AdminHeader />
        <div className="flex">
          <AdminSidebar />
          <main className="flex-1 p-6">
            {children}
          </main>
        </div>
      </div>
    </AdminRoleCheck>
  );
}
