
import React, { Suspense } from 'react';
import { Routes, Route } from 'react-router-dom';
import { AppLayout } from '@/layouts';

// Lazy-loaded pages for better performance
const Dashboard = React.lazy(() => import('@/routes/Dashboard'));
const Projects = React.lazy(() => import('@/routes/Projects'));
const Editor = React.lazy(() => import('@/routes/Editor'));
const Gallery = React.lazy(() => import('@/routes/Gallery'));
const Training = React.lazy(() => import('@/routes/Training'));
const Settings = React.lazy(() => import('@/routes/Settings'));

/**
 * AppRouter centralizes all application routes
 */
export function AppRouter() {
  return (
    <AppLayout>
      <Suspense fallback={<div className="w-full h-full flex items-center justify-center">Loading...</div>}>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/projects" element={<Projects />} />
          <Route path="/editor" element={<Editor />} />
          <Route path="/gallery" element={<Gallery />} />
          <Route path="/training" element={<Training />} />
          <Route path="/settings" element={<Settings />} />
          <Route path="*" element={<div>Not Found</div>} />
        </Routes>
      </Suspense>
    </AppLayout>
  );
}
