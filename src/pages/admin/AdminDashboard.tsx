
import React from "react";
import { Users, Database, Settings, Activity, Shield, Code, Flag, Cog } from "lucide-react";
import { AdminCard, AdminCardHeader, AdminCardTitle, AdminCardDescription, AdminCardContent } from "@/components/admin/ui/AdminCard";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { AdminLayout } from "@/components/admin/layout/AdminLayout";

export default function AdminDashboard() {
  const navigate = useNavigate();

  return (
    <AdminLayout>
      <div className="admin-container space-y-6">
        <header className="space-y-2">
          <h2 className="text-3xl font-bold tracking-tight admin-heading">Admin Dashboard</h2>
          <p className="text-muted-foreground">
            Welcome to the admin dashboard. Select a section to manage different aspects of the application.
          </p>
        </header>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          <AdminCard 
            className="admin-dashboard-card hover-scale"
            onClick={() => navigate('/admin/users')}
          >
            <AdminCardHeader>
              <div className="flex items-center justify-between">
                <AdminCardTitle>Users</AdminCardTitle>
                <Users className="h-5 w-5 admin-icon" />
              </div>
              <AdminCardDescription>Manage user accounts and permissions</AdminCardDescription>
            </AdminCardHeader>
            <AdminCardContent>
              <p className="text-sm mt-4">View, create, and manage user accounts across the platform.</p>
            </AdminCardContent>
          </AdminCard>
          
          <AdminCard 
            className="admin-dashboard-card hover-scale" 
            variant="accent"
            onClick={() => navigate('/admin/settings/general')}
          >
            <AdminCardHeader>
              <div className="flex items-center justify-between">
                <AdminCardTitle>Settings</AdminCardTitle>
                <Settings className="h-5 w-5 admin-icon" />
              </div>
              <AdminCardDescription>Configure application settings</AdminCardDescription>
            </AdminCardHeader>
            <AdminCardContent>
              <p className="text-sm mt-4">Adjust system preferences, API connections, and global settings.</p>
            </AdminCardContent>
          </AdminCard>
          
          <AdminCard 
            className="admin-dashboard-card hover-scale" 
            onClick={() => navigate('/admin/database')}
          >
            <AdminCardHeader>
              <div className="flex items-center justify-between">
                <AdminCardTitle>Database</AdminCardTitle>
                <Database className="h-5 w-5 admin-icon" />
              </div>
              <AdminCardDescription>Manage database operations</AdminCardDescription>
            </AdminCardHeader>
            <AdminCardContent>
              <p className="text-sm mt-4">Monitor and manage database connections, backups, and performance.</p>
            </AdminCardContent>
          </AdminCard>

          <AdminCard 
            className="admin-dashboard-card hover-scale" 
            variant="highlight"
            onClick={() => navigate('/admin/activity')}
          >
            <AdminCardHeader>
              <div className="flex items-center justify-between">
                <AdminCardTitle>Activity</AdminCardTitle>
                <Activity className="h-5 w-5 admin-icon" />
              </div>
              <AdminCardDescription>Monitor system activity and logs</AdminCardDescription>
            </AdminCardHeader>
            <AdminCardContent>
              <p className="text-sm mt-4">Track user sessions, system events, and application performance.</p>
            </AdminCardContent>
          </AdminCard>

          <AdminCard 
            className="admin-dashboard-card hover-scale"
            onClick={() => navigate('/admin/models')}
          >
            <AdminCardHeader>
              <div className="flex items-center justify-between">
                <AdminCardTitle>Models</AdminCardTitle>
                <Code className="h-5 w-5 admin-icon" />
              </div>
              <AdminCardDescription>Configure AI models and services</AdminCardDescription>
            </AdminCardHeader>
            <AdminCardContent>
              <p className="text-sm mt-4">Manage AI model configurations, training, and deployment.</p>
            </AdminCardContent>
          </AdminCard>

          <AdminCard 
            className="admin-dashboard-card hover-scale" 
            variant="accent"
            onClick={() => navigate('/admin/settings/feature-flags')}
          >
            <AdminCardHeader>
              <div className="flex items-center justify-between">
                <AdminCardTitle>Feature Flags</AdminCardTitle>
                <Flag className="h-5 w-5 admin-icon" />
              </div>
              <AdminCardDescription>Manage feature availability</AdminCardDescription>
            </AdminCardHeader>
            <AdminCardContent>
              <p className="text-sm mt-4">Toggle features, set up targeting, and control rollouts.</p>
            </AdminCardContent>
          </AdminCard>

          <AdminCard 
            className="admin-dashboard-card hover-scale" 
            variant="accent"
            onClick={() => navigate('/admin/security')}
          >
            <AdminCardHeader>
              <div className="flex items-center justify-between">
                <AdminCardTitle>Security</AdminCardTitle>
                <Shield className="h-5 w-5 admin-icon" />
              </div>
              <AdminCardDescription>Manage security settings</AdminCardDescription>
            </AdminCardHeader>
            <AdminCardContent>
              <p className="text-sm mt-4">Configure authentication, permissions, and security policies.</p>
            </AdminCardContent>
          </AdminCard>

          <AdminCard 
            className="admin-dashboard-card hover-scale" 
            onClick={() => navigate('/admin/settings/general')}
          >
            <AdminCardHeader>
              <div className="flex items-center justify-between">
                <AdminCardTitle>System Settings</AdminCardTitle>
                <Cog className="h-5 w-5 admin-icon" />
              </div>
              <AdminCardDescription>Global system configuration</AdminCardDescription>
            </AdminCardHeader>
            <AdminCardContent>
              <p className="text-sm mt-4">Manage system-wide settings, defaults, and configurations.</p>
            </AdminCardContent>
          </AdminCard>
        </div>

        <div className="mt-8">
          <Button 
            onClick={() => navigate('/')}
            variant="outline" 
            className="admin-secondary-button"
          >
            Return to Main App
          </Button>
        </div>
      </div>
    </AdminLayout>
  );
}
