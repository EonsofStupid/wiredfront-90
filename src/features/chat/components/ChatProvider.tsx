import React, { useEffect } from 'react';
import { Toaster } from 'sonner';
import { ChatService } from '../service';
import { useChatStore } from '../store';
import { Spinner } from './Spinner';

interface ChatProviderProps {
  children: React.ReactNode;
}

export const ChatProvider: React.FC<ChatProviderProps> = ({ children }) => {
  const {
    isInitialized,
    isLoading,
    error,
    initialize,
    updateAvailableProviders,
    setCurrentProvider,
    setError
  } = useChatStore();

  useEffect(() => {
    const initializeChat = async () => {
      try {
        const { providers } = await ChatService.initializeChat();
        updateAvailableProviders(providers);

        // Set the first available provider as current
        if (providers.length > 0) {
          setCurrentProvider(providers[0]);
        }

        await initialize();
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Failed to initialize chat';
        setError(errorMessage);
        console.error('Chat initialization error:', error);
      }
    };

    if (!isInitialized && !isLoading) {
      initializeChat();
    }
  }, [isInitialized, isLoading, initialize, updateAvailableProviders, setCurrentProvider, setError]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <Spinner size="lg" />
          <p className="mt-4 text-muted-foreground">Initializing chat system...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <p className="text-destructive">Error: {error}</p>
          <button
            className="mt-4 px-4 py-2 bg-primary text-white rounded"
            onClick={() => initialize()}
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <>
      {children}
      <Toaster position="top-right" />
    </>
  );
};
