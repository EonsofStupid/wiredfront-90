import { useState, useEffect, useRef } from 'react';
import { toast } from 'sonner';

export const useWebSocketConnection = (onMessage: (content: string) => void) => {
  const [isConnected, setIsConnected] = useState(false);
  const wsRef = useRef<WebSocket | null>(null);

  useEffect(() => {
    const connectWebSocket = () => {
      const ws = new WebSocket(`wss://ewjisqyvspdvhyppkhnm.functions.supabase.co/functions/v1/realtime-chat`);

      ws.onopen = () => {
        console.log('Connected to chat WebSocket');
        setIsConnected(true);
        toast.success('Connected to AI chat');
      };

      ws.onclose = () => {
        console.log('Disconnected from chat WebSocket');
        setIsConnected(false);
        toast.error('Disconnected from AI chat');
        // Attempt to reconnect after a delay
        setTimeout(connectWebSocket, 3000);
      };

      ws.onerror = (error) => {
        console.error('WebSocket error:', error);
        toast.error('Chat connection error');
      };

      ws.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);
          console.log('Received message:', data);
          
          if (data.type === 'response.message.delta') {
            onMessage(data.delta);
          }
        } catch (error) {
          console.error('Error processing message:', error);
        }
      };

      wsRef.current = ws;
    };

    connectWebSocket();

    return () => {
      if (wsRef.current) {
        wsRef.current.close();
      }
    };
  }, [onMessage]);

  const sendMessage = async (message: any) => {
    if (wsRef.current?.readyState === WebSocket.OPEN) {
      wsRef.current.send(JSON.stringify(message));
      return true;
    }
    toast.error('Chat connection not ready');
    return false;
  };

  return { isConnected, sendMessage };
};