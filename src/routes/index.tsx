import { EditorModeProvider } from '@/components/editor/providers/EditorModeProvider';
import { AppLayout } from '@/components/layout/AppLayout';
import { CoreLayout } from '@/core/layout/CoreLayout';
import React from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';

// Page imports
import Dashboard from '@/pages/Dashboard';
import Documents from '@/pages/Documents';
import Editor from '@/pages/Editor';
import Index from '@/pages/Index';
import Login from '@/pages/Login';
import Settings from '@/pages/Settings';
import GitHubCallback from '@/pages/github-callback';

// Admin routes
import { AdminTopNavOverlay } from '@/components/admin/navigation/AdminTopNavOverlay';
import { adminRoutes } from './admin';

// Route configurations
export const PUBLIC_ROUTES = ['/', '/login', '/github-callback'];

export const PROTECTED_ROUTES = [
  '/dashboard',
  '/editor',
  '/documents',
  '/ai',
  '/analytics',
  '/gallery',
  '/training',
  '/settings',
  '/admin'
];

interface RoutesProps {
  isAuthenticated: boolean;
  isPublicRoute: boolean;
  isAdminRoute: boolean;
}

export const AppRoutes: React.FC<RoutesProps> = ({
  isAuthenticated,
  isPublicRoute,
  isAdminRoute
}) => {
  if (!isAuthenticated && !isPublicRoute) {
    return <Navigate to="/login" replace />;
  }

  if (isPublicRoute) {
    return (
      <AppLayout>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/login" element={<Login />} />
          <Route path="/github-callback" element={<GitHubCallback />} />
        </Routes>
      </AppLayout>
    );
  }

  return (
    <CoreLayout>
      {isAdminRoute && <AdminTopNavOverlay />}
      <Routes>
        {/* Protected Routes */}
        <Route path="/dashboard" element={<Dashboard />} />
        <Route
          path="/editor"
          element={
            <EditorModeProvider>
              <Editor />
            </EditorModeProvider>
          }
        />
        <Route path="/documents" element={<Documents />} />
        <Route path="/settings" element={<Settings />} />
        <Route path="/gallery" element={<div>Gallery</div>} />
        <Route path="/training" element={<div>Training</div>} />

        {/* Admin Routes */}
        {adminRoutes}

        {/* Catch-all redirect */}
        <Route path="*" element={<Navigate to="/dashboard" replace />} />
      </Routes>
    </CoreLayout>
  );
};
