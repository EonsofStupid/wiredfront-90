
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Toaster } from 'sonner';
import Editor from './pages/Editor';
import { CyberpunkChatRoot } from './components/chat/CyberpunkChatRoot';

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-dark">
        <Routes>
          <Route path="/editor" element={<Editor />} />
          <Route path="/" element={<div className="flex items-center justify-center min-h-screen text-white">Welcome to Wired Front</div>} />
        </Routes>
        
        <CyberpunkChatRoot />
        <Toaster position="top-right" />
      </div>
    </Router>
  );
}

export default App;
