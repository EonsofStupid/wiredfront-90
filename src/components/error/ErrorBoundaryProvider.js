import { jsx as _jsx } from "react/jsx-runtime";
import { ErrorBoundary } from '@/components/error/ErrorBoundary';
import { logger } from '@/services/chat/LoggingService';
import { createContext, useCallback, useContext, useState } from 'react';
const ErrorBoundaryContext = createContext(undefined);
export const ErrorBoundaryProvider = ({ children }) => {
    const [lastError, setLastError] = useState(null);
    const logError = useCallback((error, componentStack, componentName) => {
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
    return (_jsx(ErrorBoundaryContext.Provider, { value: {
            ErrorBoundary,
            logError,
            lastError,
            clearError
        }, children: children }));
};
export const useErrorBoundary = () => {
    const context = useContext(ErrorBoundaryContext);
    if (!context) {
        throw new Error('useErrorBoundary must be used within an ErrorBoundaryProvider');
    }
    return context;
};
