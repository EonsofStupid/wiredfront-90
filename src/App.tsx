
import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { Toaster } from 'sonner';
import Layout from './components/layout/Layout';
import { routes } from './routes';
import { ChatIntegration } from './components/chat/ChatIntegration';
import { useTheme } from './contexts/ThemeContext';

function App() {
  const { theme } = useTheme();

  return (
    <div className={theme}>
      <Toaster position="top-right" />
      
      {/* Chat Integration */}
      <ChatIntegration />
      
      <Routes>
        <Route element={<Layout />}>
          {routes.map((route) => (
            <Route
              key={route.path}
              path={route.path}
              element={route.element}
            />
          ))}
        </Route>
      </Routes>
    </div>
  );
}

export default App;
