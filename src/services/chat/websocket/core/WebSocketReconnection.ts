import { WebSocketLogger } from '../monitoring/WebSocketLogger';
import { ConnectionState } from '@/types/websocket';
import { toast } from 'sonner';

export class WebSocketReconnection {
  private attempts: number = 0;
  private readonly maxAttempts: number = 5;
  private readonly maxBackoff: number = 30000;
  private reconnectTimeout: NodeJS.Timeout | null = null;

  constructor(
    private logger: WebSocketLogger,
    private sessionId: string,
    private onStateChange: (state: ConnectionState) => void,
    private connectFn: () => Promise<void>
  ) {}

  private calculateBackoff(): number {
    const backoff = Math.min(1000 * Math.pow(2, this.attempts), this.maxBackoff);
    const jitter = Math.random() * 0.2 * backoff;
    return backoff + jitter;
  }

  async handleReconnection(): Promise<void> {
    if (this.reconnectTimeout) {
      clearTimeout(this.reconnectTimeout);
    }

    if (this.attempts >= this.maxAttempts) {
      this.logger.error('Max reconnection attempts reached', {
        sessionId: this.sessionId,
        attempts: this.attempts
      });
      this.onStateChange('failed');
      toast.error('Failed to reconnect after multiple attempts');
      return;
    }

    const backoff = this.calculateBackoff();
    this.attempts++;

    this.logger.info('Planning reconnection', {
      attempt: this.attempts,
      backoff,
      sessionId: this.sessionId
    });

    this.onStateChange('reconnecting');
    toast.loading(`Reconnecting in ${Math.round(backoff/1000)}s (Attempt ${this.attempts}/${this.maxAttempts})`);

    this.reconnectTimeout = setTimeout(async () => {
      try {
        await this.connectFn();
      } catch (error) {
        this.logger.error('Reconnection attempt failed', {
          error,
          attempt: this.attempts,
          sessionId: this.sessionId
        });
        this.handleReconnection();
      }
    }, backoff);
  }

  getAttempts(): number {
    return this.attempts;
  }

  reset(): void {
    this.attempts = 0;
    if (this.reconnectTimeout) {
      clearTimeout(this.reconnectTimeout);
      this.reconnectTimeout = null;
    }
  }
}