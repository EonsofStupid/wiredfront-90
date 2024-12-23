import { logger } from '@/services/chat/LoggingService';
import { ConnectionMetrics } from '@/types/websocket';
import { toast } from 'sonner';

export class WebSocketMessageHandler {
  constructor(
    private sessionId: string,
    private onMessage?: (data: any) => void,
    private onMetricsUpdate?: (metrics: Partial<ConnectionMetrics>) => void
  ) {
    logger.info('WebSocket message handler initialized',
      { sessionId },
      sessionId,
      { component: 'WebSocketMessageHandler', action: 'initialize' }
    );
  }

  handleMessage(data: any) {
    try {
      logger.debug('Processing WebSocket message',
        { 
          messageType: data?.type,
          timestamp: new Date().toISOString()
        },
        this.sessionId,
        { component: 'WebSocketMessageHandler', action: 'handleMessage' }
      );

      if (data.type === 'error') {
        toast.error(data.message || 'An error occurred');
        return;
      }

      this.onMessage?.(data);
      
    } catch (error) {
      logger.error('Failed to process WebSocket message',
        { 
          error,
          data,
          timestamp: new Date().toISOString()
        },
        this.sessionId,
        { component: 'WebSocketMessageHandler', action: 'handleMessage', error: error as Error }
      );
      toast.error('Failed to process message');
    }
  }

  handleError(error: Error) {
    logger.error('WebSocket error occurred',
      { 
        error,
        timestamp: new Date().toISOString()
      },
      this.sessionId,
      { component: 'WebSocketMessageHandler', action: 'handleError', error }
    );
    
    this.onMetricsUpdate?.({
      lastError: error,
      lastConnected: null
    });
    
    toast.error('Connection error occurred');
  }
}