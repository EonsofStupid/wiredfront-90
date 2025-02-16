import React from "react";
import { AdminLayout } from "@/components/admin/layout/AdminLayout";

export default function AdminDashboard() {
  return (
    <AdminLayout>
      <div className="space-y-4">
        <h2 className="text-3xl font-bold tracking-tight">Admin Dashboard</h2>
        <p className="text-muted-foreground">
          Welcome to the admin dashboard. Select a section from the sidebar to manage different aspects of the application.
        </p>
      </div>
    </AdminLayout>
  );
}