
import { useState } from 'react';
import { supabase } from "@/integrations/supabase/client";
import { useMessageStore } from '@/features/chat/hooks/useMessageStore';
import { useSessionManager } from "@/features/chat/hooks/useSessionManager";
import { toast } from "sonner";

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
      if (!currentSessionId) throw new Error('Failed to create chat session');

      await addMessage({
        content: `Establishing connection to ${configName}...`,
        role: 'system',
        sessionId: currentSessionId
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
          role: 'system',
          sessionId: currentSessionId
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
          role: 'system',
          sessionId: currentSessionId
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
