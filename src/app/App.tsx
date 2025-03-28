
import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import { AppProviders } from './providers';
import { AppRouter } from './router';

/**
 * Main application component
 * Separation of concerns:
 * - BrowserRouter handles URL routing
 * - AppProviders centralizes all application providers
 * - AppRouter manages all application routes
 */
function App() {
  return (
    <BrowserRouter>
      <AppProviders>
        <AppRouter />
      </AppProviders>
    </BrowserRouter>
  );
}

export default App;
