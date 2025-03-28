
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Toaster } from '@/components/ui/toaster';
import MainLayout from '@/layouts/MainLayout';
import { 
  ChatBridgeProvider, 
  ModeProvider 
} from '@/components/chat';
import { AuthProvider } from '@/auth/AuthProvider';

// Lazy-loaded pages for better performance
const Dashboard = React.lazy(() => import('@/pages/Dashboard'));
const Projects = React.lazy(() => import('@/pages/Projects'));
const Editor = React.lazy(() => import('@/pages/Editor'));
const Gallery = React.lazy(() => import('@/pages/Gallery'));
const Training = React.lazy(() => import('@/pages/Training'));
const Settings = React.lazy(() => import('@/pages/Settings'));

function App() {
  return (
    <AuthProvider>
      <ChatBridgeProvider>
        <ModeProvider>
          <Router>
            <MainLayout>
              <React.Suspense fallback={<div>Loading...</div>}>
                <Routes>
                  <Route path="/" element={<Dashboard />} />
                  <Route path="/projects" element={<Projects />} />
                  <Route path="/editor" element={<Editor />} />
                  <Route path="/gallery" element={<Gallery />} />
                  <Route path="/training" element={<Training />} />
                  <Route path="/settings" element={<Settings />} />
                  <Route path="*" element={<div>Not Found</div>} />
                </Routes>
              </React.Suspense>
            </MainLayout>
          </Router>
          <Toaster />
        </ModeProvider>
      </ChatBridgeProvider>
    </AuthProvider>
  );
}

export default App;
