import { useState, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { logger } from '../LoggingService';

export const useMessageStatus = (sessionId: string) => {
  const [processingMessages, setProcessingMessages] = useState<Set<string>>(new Set());

  const updateMessageStatus = useCallback(async (messageId: string, status: string) => {
    try {
      const { error } = await supabase
        .from('messages')
        .update({ processing_status: status })
        .eq('id', messageId);

      if (error) throw error;

      setProcessingMessages(prev => {
        const updated = new Set(prev);
        if (status === 'processing') {
          updated.add(messageId);
        } else {
          updated.delete(messageId);
        }
        return updated;
      });
    } catch (error) {
      logger.error('Error updating message status:', error);
      toast.error('Failed to update message status');
    }
  }, []);

  return {
    processingMessages,
    updateMessageStatus,
    isProcessing: (messageId: string) => processingMessages.has(messageId)
  };
};