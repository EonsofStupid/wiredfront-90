
import { useState, useCallback } from 'react';
import { logger } from '@/services/chat/LoggingService';
import { toast } from 'sonner';

interface ErrorHandlerOptions {
  showToast?: boolean;
  logError?: boolean;
  fallbackValue?: any;
  context?: string;
}

const defaultOptions: ErrorHandlerOptions = {
  showToast: true,
  logError: true,
  fallbackValue: null,
  context: 'generic'
};

export function useErrorHandler<T = any>(options: ErrorHandlerOptions = {}) {
  const [error, setError] = useState<Error | null>(null);
  const [isRecovering, setIsRecovering] = useState(false);

  const opts = { ...defaultOptions, ...options };

  const handleError = useCallback((error: unknown, customMessage?: string) => {
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

  const recoverFromError = useCallback(async (recoveryFn: () => Promise<void>) => {
    if (!error) return;

    setIsRecovering(true);
    try {
      await recoveryFn();
      clearError();
    } catch (recoveryError) {
      handleError(recoveryError, 'Error during recovery attempt');
    } finally {
      setIsRecovering(false);
    }
  }, [error, handleError, clearError]);

  const wrapPromise = useCallback(async <R>(promise: Promise<R>): Promise<R | null> => {
    try {
      return await promise;
    } catch (err) {
      handleError(err);
      return opts.fallbackValue as null;
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
