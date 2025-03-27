import { useState, useEffect } from 'react';
import { logger } from '@/services/chat/LoggingService';
import { AIProviderService } from '@/components/chat/shared/services/llm/aiprovider-service/AIProviderService';
import { ChatProvider } from '@/components/chat/shared/types/chat-provider';

export function useAIProviders() {
  const [providers, setProviders] = useState<ChatProvider[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    loadProviders();
  }, []);

  const loadProviders = async () => {
    try {
      setIsLoading(true);
      const allProviders = await AIProviderService.getAllProviders();
      setProviders(allProviders);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to load providers'));
      logger.error('Error loading AI providers', err);
    } finally {
      setIsLoading(false);
    }
  };

  return {
    providers,
    isLoading,
    error,
    refreshProviders: loadProviders
  };
} 