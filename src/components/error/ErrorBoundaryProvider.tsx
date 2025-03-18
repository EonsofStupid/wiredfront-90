
import React, { createContext, useContext, useState, useCallback } from 'react';
import { ErrorBoundary } from './ErrorBoundary';
import { logger } from '@/services/chat/LoggingService';

interface ErrorBoundaryContextType {
  ErrorBoundary: typeof ErrorBoundary;
  logError: (error: Error, componentStack?: string, componentName?: string) => void;
  lastError: Error | null;
  clearError: () => void;
}

const ErrorBoundaryContext = createContext<ErrorBoundaryContextType | undefined>(undefined);

export const ErrorBoundaryProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [lastError, setLastError] = useState<Error | null>(null);

  const logError = useCallback((error: Error, componentStack?: string, componentName?: string) => {
    setLastError(error);
    logger.error('Component error caught by error boundary', {
      error: error.message,
      componentName,
      componentStack,
      stack: error.stack
    });
  }, []);

  const clearError = useCallback(() => {
    setLastError(null);
  }, []);

  return (
    <ErrorBoundaryContext.Provider value={{ 
      ErrorBoundary, 
      logError, 
      lastError,
      clearError 
    }}>
      {children}
    </ErrorBoundaryContext.Provider>
  );
};

export const useErrorBoundary = () => {
  const context = useContext(ErrorBoundaryContext);
  if (!context) {
    throw new Error('useErrorBoundary must be used within an ErrorBoundaryProvider');
  }
  return context;
};
