
import React from "react";
import { AdminLayout } from "@/components/admin/layout/AdminLayout";
import { AdminContentLayout } from "@/components/admin/layout/AdminContentLayout";

export default function AdminDashboard() {
  return (
    <AdminLayout>
      <AdminContentLayout>
        <div className="space-y-4">
          <h2 className="text-3xl font-bold tracking-tight">Admin Dashboard</h2>
          <p className="text-muted-foreground">
            Welcome to the admin dashboard. Select a section from the navigation bar above to manage different aspects of the application.
          </p>
        </div>
      </AdminContentLayout>
    </AdminLayout>
  );
}
