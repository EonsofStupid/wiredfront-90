import { useState, useEffect, useRef, useCallback } from 'react';
import { toast } from 'sonner';
import { logger } from '@/services/chat/LoggingService';
import { WEBSOCKET_URL } from '@/constants/websocket';
import { supabase } from "@/integrations/supabase/client";
import { useChatAPI } from '@/hooks/chat/useChatAPI';
import { useSessionStore } from '@/stores/session/store';

export const useWebSocketConnection = (onMessage: (content: string) => void) => {
  const [isConnected, setIsConnected] = useState(false);
  const wsRef = useRef<WebSocket | null>(null);
  const reconnectTimeoutRef = useRef<NodeJS.Timeout>();
  const mountedRef = useRef(true);
  const connectionAttemptsRef = useRef(0);
  const { apiSettings } = useChatAPI();
  const user = useSessionStore(state => state.user);
  
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
    setIsConnected(false);
  }, []);

  const connect = useCallback(async () => {
    if (!mountedRef.current || connectionAttemptsRef.current >= MAX_RECONNECT_ATTEMPTS) {
      if (connectionAttemptsRef.current >= MAX_RECONNECT_ATTEMPTS) {
        logger.error('Maximum reconnection attempts reached');
        toast.error('Unable to establish connection. Please try again later.');
        return;
      }
      return;
    }

    try {
      let wsUrl = WEBSOCKET_URL;
      
      if (user) {
        // Authenticated connection
        const { data: { session } } = await supabase.auth.getSession();
        if (!session?.access_token) {
          throw new Error('No valid session found');
        }
        wsUrl = `${WEBSOCKET_URL}?access_token=${session.access_token}`;
      }

      cleanup();
      connectionAttemptsRef.current++;

      logger.info('Connecting to WebSocket:', { wsUrl, isAuthenticated: !!user });
      
      wsRef.current = new WebSocket(wsUrl);
      setupEventHandlers();
      
    } catch (error) {
      logger.error('Connection failed:', error);
      await handleReconnect();
    }
  }, [cleanup, user]);

  const setupEventHandlers = () => {
    if (!wsRef.current) return;

    wsRef.current.onopen = () => {
      logger.info('WebSocket connected');
      setIsConnected(true);
      connectionAttemptsRef.current = 0;
      toast.success(`Connected to chat service ${user ? '' : '(Limited Mode)'}`);
    };

    wsRef.current.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        logger.debug('Received message:', data);
        onMessage?.(data);
      } catch (error) {
        logger.error('Failed to process message:', error);
      }
    };

    wsRef.current.onerror = (error) => {
      logger.error('WebSocket error occurred:', error);
      setIsConnected(false);
      toast.error('Connection error occurred');
    };

    wsRef.current.onclose = () => {
      logger.info('WebSocket disconnected');
      setIsConnected(false);
      handleReconnect();
      toast.error(`Disconnected from chat service ${user ? '' : '(Limited Mode)'}`);
    };
  };

  const handleReconnect = async () => {
    if (connectionAttemptsRef.current < MAX_RECONNECT_ATTEMPTS) {
      logger.info('Attempting to reconnect...');
      toast.info('Attempting to reconnect...');
      reconnectTimeoutRef.current = setTimeout(connect, RECONNECT_DELAY);
    }
  };

  useEffect(() => {
    mountedRef.current = true;
    connect();

    return () => {
      mountedRef.current = false;
      cleanup();
    };
  }, [connect, cleanup, user]);

  const sendMessage = useCallback(async (message: any) => {
    if (!isConnected) {
      toast.error('Not connected to chat service');
      return false;
    }
    
    if (wsRef.current?.readyState === WebSocket.OPEN) {
      try {
        wsRef.current.send(JSON.stringify(message));
        return true;
      } catch (error) {
        logger.error('Failed to send message:', error);
        return false;
      }
    }
    return false;
  }, [isConnected]);

  return { isConnected, sendMessage };
};