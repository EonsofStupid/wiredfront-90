
import React from "react";

export default function AdminDashboard() {
  return (
    <div className="space-y-4">
      <h2 className="text-3xl font-bold tracking-tight">Admin Dashboard</h2>
      <p className="text-muted-foreground">
        Welcome to the admin dashboard. Select a section to manage different aspects of the application.
      </p>
      
      {/* Admin dashboard content will go here */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <div className="p-4 border rounded-lg bg-card">
          <h3 className="font-medium mb-2">Users</h3>
          <p className="text-sm text-muted-foreground">Manage user accounts and permissions</p>
        </div>
        
        <div className="p-4 border rounded-lg bg-card">
          <h3 className="font-medium mb-2">Settings</h3>
          <p className="text-sm text-muted-foreground">Configure application settings</p>
        </div>
        
        <div className="p-4 border rounded-lg bg-card">
          <h3 className="font-medium mb-2">Database</h3>
          <p className="text-sm text-muted-foreground">Manage database operations</p>
        </div>
      </div>
    </div>
  );
}
