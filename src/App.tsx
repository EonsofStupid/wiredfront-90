
import React, { useEffect } from 'react';
import { Routes, Route } from 'react-router-dom';
import { AppLayout } from './components/layout/AppLayout';
import { MainLayout } from './components/layout/MainLayout';
import { Chat } from './components/chat';
import { setupZIndexVars } from './styles/setup/injectZIndexVars';
import { ZIndexVisualizer } from './components/debug/ZIndexVisualizer';
import './App.css';

// Import your page components here
import Dashboard from './pages/Dashboard';
import Settings from './pages/Settings';
import Documents from './pages/Documents';
import Editor from './pages/Editor';
import Index from './pages/Index';

function App() {
  // Initialize z-index CSS variables
  useEffect(() => {
    setupZIndexVars();
    console.log('Z-index CSS variables injected');
  }, []);

  return (
    <AppLayout>
      <Routes>
        <Route path="/" element={<Index />} />
        <Route path="/dashboard" element={
          <MainLayout>
            <Dashboard />
          </MainLayout>
        } />
        <Route path="/settings" element={
          <MainLayout>
            <Settings />
          </MainLayout>
        } />
        <Route path="/documents" element={
          <MainLayout>
            <Documents />
          </MainLayout>
        } />
        <Route path="/editor" element={
          <MainLayout>
            <Editor />
          </MainLayout>
        } />
        {/* Add more routes as needed */}
      </Routes>
      
      {/* Chat component rendered outside of MainLayout for proper z-indexing */}
      <Chat />
      
      {/* ZIndexVisualizer is now toggled by the wrench icon in the bottom bar */}
    </AppLayout>
  );
}

export default App;
