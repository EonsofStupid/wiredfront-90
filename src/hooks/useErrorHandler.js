import { useState, useCallback } from 'react';
import { logger } from '@/services/chat/LoggingService';
import { toast } from 'sonner';
const defaultOptions = {
    showToast: true,
    logError: true,
    fallbackValue: null,
    context: 'generic'
};
export function useErrorHandler(options = {}) {
    const [error, setError] = useState(null);
    const [isRecovering, setIsRecovering] = useState(false);
    const opts = { ...defaultOptions, ...options };
    const handleError = useCallback((error, customMessage) => {
        const errorObj = error instanceof Error ? error : new Error(String(error));
        setError(errorObj);
        if (opts.logError) {
            logger.error(customMessage || 'Error caught by useErrorHandler', {
                error: errorObj,
                context: opts.context
            });
        }
        if (opts.showToast) {
            toast.error(customMessage || 'An error occurred', {
                description: errorObj.message.substring(0, 100),
                position: 'bottom-center',
            });
        }
        return errorObj;
    }, [opts]);
    const clearError = useCallback(() => {
        setError(null);
    }, []);
    const recoverFromError = useCallback(async (recoveryFn) => {
        if (!error)
            return;
        setIsRecovering(true);
        try {
            await recoveryFn();
            clearError();
        }
        catch (recoveryError) {
            handleError(recoveryError, 'Error during recovery attempt');
        }
        finally {
            setIsRecovering(false);
        }
    }, [error, handleError, clearError]);
    const wrapPromise = useCallback(async (promise) => {
        try {
            return await promise;
        }
        catch (err) {
            handleError(err);
            return opts.fallbackValue;
        }
    }, [handleError, opts.fallbackValue]);
    return {
        error,
        isRecovering,
        handleError,
        clearError,
        recoverFromError,
        wrapPromise
    };
}
