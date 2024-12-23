import { useState, useEffect } from 'react';
import { Message } from '@/types/chat';
import { supabase } from "@/integrations/supabase/client";
import { logger } from '@/services/chat/LoggingService';

export const useMessageCache = (sessionId: string) => {
  const [maxOfflineMessages, setMaxOfflineMessages] = useState(100);

  const loadCacheConfig = async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from('chat_settings')
        .select('max_offline_messages, offline_mode_enabled')
        .eq('user_id', userId)
        .single();

      if (error) throw error;

      if (data) {
        setMaxOfflineMessages(data.max_offline_messages);
      }
    } catch (error) {
      logger.error('Failed to load cache configuration:', error);
    }
  };

  const cacheMessages = async (messages: Message[]) => {
    try {
      const trimmedMessages = messages.slice(0, maxOfflineMessages);
      localStorage.setItem(`chat_cache_${sessionId}`, JSON.stringify(trimmedMessages));
      logger.info(`Cached ${trimmedMessages.length} messages for session ${sessionId}`);
    } catch (error) {
      logger.error('Failed to cache messages:', error);
    }
  };

  const getCachedMessages = (): Message[] => {
    try {
      const cached = localStorage.getItem(`chat_cache_${sessionId}`);
      return cached ? JSON.parse(cached) : [];
    } catch (error) {
      logger.error('Failed to retrieve cached messages:', error);
      return [];
    }
  };

  return {
    loadCacheConfig,
    cacheMessages,
    getCachedMessages,
    maxOfflineMessages
  };
};