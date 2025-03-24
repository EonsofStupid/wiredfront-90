import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AppLayout } from './components/layout/AppLayout';
import { MainLayout } from './components/layout/MainLayout';
import { Chat } from './components/chat';
import './App.css';

// Import your page components here
import Dashboard from './pages/Dashboard';
import Settings from './pages/Settings';

function App() {
  return (
    <AppLayout>
      <Router>
        <MainLayout>
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/settings" element={<Settings />} />
            {/* Add more routes as needed */}
          </Routes>
        </MainLayout>
        
        {/* Chat component rendered outside of MainLayout for proper z-indexing */}
        <Chat />
      </Router>
    </AppLayout>
  );
}

export default App;
