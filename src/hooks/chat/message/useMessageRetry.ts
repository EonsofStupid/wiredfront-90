import { useState } from 'react';
import { supabase } from "@/integrations/supabase/client";
import { logger } from '@/services/chat/LoggingService';
import { Message } from '@/types/chat';

interface RetryConfig {
  maxRetries: number;
  initialDelay: number;
  maxDelay: number;
  backoffFactor: number;
}

export const useMessageRetry = (sessionId: string) => {
  const [retryConfig, setRetryConfig] = useState<RetryConfig>({
    maxRetries: 3,
    initialDelay: 1000,
    maxDelay: 30000,
    backoffFactor: 2
  });

  const loadRetryConfig = async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from('retry_configurations')
        .select('*')
        .eq('user_id', userId)
        .single();

      if (error) throw error;

      if (data) {
        setRetryConfig({
          maxRetries: data.max_retries,
          initialDelay: data.initial_retry_delay,
          maxDelay: data.max_retry_delay,
          backoffFactor: data.backoff_factor
        });
      }
    } catch (error) {
      logger.error('Failed to load retry configuration:', error);
    }
  };

  const calculateRetryDelay = (attempts: number): number => {
    const delay = retryConfig.initialDelay * Math.pow(retryConfig.backoffFactor, attempts);
    return Math.min(delay, retryConfig.maxDelay);
  };

  const shouldRetry = (message: Message): boolean => {
    return message.retry_count < retryConfig.maxRetries;
  };

  return {
    retryConfig,
    loadRetryConfig,
    calculateRetryDelay,
    shouldRetry
  };
};