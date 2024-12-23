import { useState, useEffect } from 'react';
import { supabase } from "@/integrations/supabase/client";
import { logger } from '@/services/chat/LoggingService';

export const useMessageRateLimit = () => {
  const [rateLimit, setRateLimit] = useState(60);
  const [messageCount, setMessageCount] = useState(0);

  const loadRateLimitConfig = async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from('chat_settings')
        .select('rate_limit_per_minute')
        .eq('user_id', userId)
        .single();

      if (error) throw error;

      if (data) {
        setRateLimit(data.rate_limit_per_minute);
      }
    } catch (error) {
      logger.error('Failed to load rate limit configuration:', error);
    }
  };

  const checkRateLimit = (): boolean => {
    return messageCount < rateLimit;
  };

  const incrementMessageCount = () => {
    setMessageCount(prev => prev + 1);
  };

  // Reset message count every minute
  useEffect(() => {
    const interval = setInterval(() => {
      setMessageCount(0);
    }, 60000);

    return () => clearInterval(interval);
  }, []);

  return {
    loadRateLimitConfig,
    checkRateLimit,
    incrementMessageCount,
    rateLimit,
    messageCount
  };
};