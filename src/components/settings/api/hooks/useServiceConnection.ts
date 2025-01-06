import { useState } from 'react';
import { supabase } from "@/integrations/supabase/client";
import { useMessageStore } from "@/features/chat/core/messaging/MessageManager";
import { useSessionManager } from "@/hooks/useSessionManager";
import { toast } from "sonner";
import { MessageMetadata } from '../types';

export const useServiceConnection = () => {
  const [isConnecting, setIsConnecting] = useState(false);
  const [selectedConfig, setSelectedConfig] = useState<string | null>(null);
  const { addMessage } = useMessageStore();
  const { createSession } = useSessionManager();

  const handleConnect = async (configId: string, configName: string, provider: string) => {
    let currentSessionId: string | null = null;

    try {
      setIsConnecting(true);
      setSelectedConfig(configId);

      currentSessionId = await createSession();

      await addMessage({
        content: `Establishing connection to ${configName}...`,
        type: 'system',
        chat_session_id: currentSessionId,
        metadata: {
          configId,
          provider,
          status: 'connecting'
        } as MessageMetadata
      });

      const { data, error } = await supabase.functions.invoke('test-ai-connection', {
        body: {
          provider,
          configId
        }
      });

      if (error) throw error;

      if (data.success) {
        await addMessage({
          content: `Successfully connected to ${configName}. You can now start chatting!`,
          type: 'system',
          chat_session_id: currentSessionId,
          metadata: {
            configId,
            provider,
            status: 'connected'
          } as MessageMetadata
        });

        toast.success(`Connected to ${configName} successfully`);
      } else {
        throw new Error('Failed to connect to AI service');
      }

    } catch (error) {
      console.error('Connection error:', error);
      toast.error("Failed to connect to AI service");
      
      if (currentSessionId) {
        await addMessage({
          content: `Failed to connect: ${error.message}`,
          type: 'system',
          chat_session_id: currentSessionId,
          metadata: {
            configId,
            provider,
            status: 'error',
            error: error.message
          } as MessageMetadata
        });
      }
    } finally {
      setIsConnecting(false);
      setSelectedConfig(null);
    }
  };

  return {
    isConnecting,
    selectedConfig,
    handleConnect
  };
};