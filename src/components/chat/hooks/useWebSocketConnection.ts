import { useState, useEffect, useRef, useCallback } from 'react';
import { toast } from 'sonner';
import { logger } from '@/services/chat/LoggingService';
import { WEBSOCKET_URL } from '@/constants/websocket';
import { supabase } from "@/integrations/supabase/client";
import { useChatAPI } from '@/hooks/chat/useChatAPI';

export const useWebSocketConnection = (onMessage: (content: string) => void) => {
  const [isConnected, setIsConnected] = useState(false);
  const wsRef = useRef<WebSocket | null>(null);
  const reconnectTimeoutRef = useRef<NodeJS.Timeout>();
  const mountedRef = useRef(true);
  const connectionAttemptsRef = useRef(0);
  const { apiSettings, getDefaultProvider } = useChatAPI();
  
  const MAX_RECONNECT_ATTEMPTS = 3;
  const RECONNECT_DELAY = 3000;

  const cleanup = useCallback(() => {
    if (wsRef.current) {
      wsRef.current.close();
      wsRef.current = null;
    }
    if (reconnectTimeoutRef.current) {
      clearTimeout(reconnectTimeoutRef.current);
      reconnectTimeoutRef.current = undefined;
    }
  }, []);

  const connect = useCallback(async () => {
    if (!mountedRef.current || connectionAttemptsRef.current >= MAX_RECONNECT_ATTEMPTS) {
      if (connectionAttemptsRef.current >= MAX_RECONNECT_ATTEMPTS) {
        logger.error('Maximum reconnection attempts reached');
        toast.error('Unable to establish connection. Please try again later.', {
          id: 'ws-max-attempts'
        });
      }
      return;
    }

    // Check for valid API configuration
    const defaultProvider = getDefaultProvider();
    if (!defaultProvider || !apiSettings?.[defaultProvider]) {
      logger.error('No valid API configuration found');
      toast.error('Please configure an AI provider in settings', {
        id: 'missing-api-config'
      });
      return;
    }

    cleanup();
    connectionAttemptsRef.current++;

    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session?.access_token) {
        throw new Error('No valid session found');
      }

      const wsUrl = `${WEBSOCKET_URL}?access_token=${session.access_token}&provider=${defaultProvider}`;
      
      const ws = new WebSocket(wsUrl);
      wsRef.current = ws;

      ws.onopen = () => {
        if (!mountedRef.current) return;
        logger.info('Connected to chat WebSocket');
        setIsConnected(true);
        connectionAttemptsRef.current = 0;
        toast.success('Connected to AI chat', { id: 'ws-connected' });
      };

      ws.onclose = (event: CloseEvent) => {
        if (!mountedRef.current) return;
        logger.info('Disconnected from chat WebSocket');
        setIsConnected(false);
        wsRef.current = null;

        if (!event.wasClean && mountedRef.current && connectionAttemptsRef.current < MAX_RECONNECT_ATTEMPTS) {
          reconnectTimeoutRef.current = setTimeout(connect, RECONNECT_DELAY);
        }
      };

      ws.onerror = (error: Event) => {
        if (!mountedRef.current) return;
        logger.error('WebSocket error:', error);
        
        if (connectionAttemptsRef.current >= MAX_RECONNECT_ATTEMPTS) {
          toast.error('Connection error occurred', { id: 'ws-error' });
        }
      };

      ws.onmessage = (event) => {
        if (!mountedRef.current) return;
        try {
          const data = JSON.parse(event.data);
          if (data.type === 'response.message.delta') {
            onMessage(data.delta);
          }
        } catch (error) {
          logger.error('Error processing message:', error);
        }
      };
    } catch (error) {
      logger.error('Failed to create WebSocket connection:', error);
      if (mountedRef.current && connectionAttemptsRef.current < MAX_RECONNECT_ATTEMPTS) {
        reconnectTimeoutRef.current = setTimeout(connect, RECONNECT_DELAY);
      }
    }
  }, [cleanup, onMessage, apiSettings, getDefaultProvider]);

  useEffect(() => {
    mountedRef.current = true;
    connectionAttemptsRef.current = 0;

    // Only attempt connection if we have valid API settings
    if (apiSettings && Object.keys(apiSettings).length > 0) {
      connect();
    } else {
      logger.warn('No API settings configured, skipping WebSocket connection');
    }
    
    return () => {
      mountedRef.current = false;
      cleanup();
    };
  }, [connect, cleanup, apiSettings]);

  const sendMessage = useCallback(async (message: any) => {
    if (wsRef.current?.readyState === WebSocket.OPEN) {
      wsRef.current.send(JSON.stringify(message));
      return true;
    }
    return false;
  }, []);

  return { isConnected, sendMessage };
};