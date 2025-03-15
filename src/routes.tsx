
import React from 'react';
import { lazy } from 'react';

// Lazy-loaded route components
const Dashboard = lazy(() => import('./pages/Dashboard'));
const Gallery = lazy(() => import('./pages/Gallery'));

export const routes = [
  {
    path: '/',
    element: <Dashboard />
  },
  {
    path: '/gallery',
    element: <Gallery />
  }
];
