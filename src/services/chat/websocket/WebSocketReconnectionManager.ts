import { WebSocketLogger } from '../WebSocketLogger';
import { WebSocketEventEmitter } from './WebSocketEventEmitter';
import { toast } from 'sonner';

export class WebSocketReconnectionManager {
  private reconnectAttempts = 0;
  private readonly maxReconnectAttempts = 5;

  constructor(
    private logger: WebSocketLogger,
    private eventEmitter: WebSocketEventEmitter
  ) {}

  async handleReconnect(connect: () => Promise<void>) {
    if (this.reconnectAttempts >= this.maxReconnectAttempts) {
      this.eventEmitter.emitStateChange('failed');
      toast.error('Max reconnection attempts reached');
      return;
    }

    this.reconnectAttempts++;
    this.eventEmitter.emitStateChange('reconnecting');
    toast.loading(`Reconnecting (Attempt ${this.reconnectAttempts}/${this.maxReconnectAttempts})`);

    const delay = Math.min(1000 * Math.pow(2, this.reconnectAttempts), 30000);
    await new Promise(resolve => setTimeout(resolve, delay));

    try {
      await connect();
    } catch (error) {
      this.logger.error('Reconnection attempt failed', {
        error,
        attempt: this.reconnectAttempts,
        timestamp: new Date().toISOString()
      });
      toast.error('Reconnection attempt failed');
    }
  }

  resetAttempts() {
    this.reconnectAttempts = 0;
  }

  getAttempts(): number {
    return this.reconnectAttempts;
  }
}