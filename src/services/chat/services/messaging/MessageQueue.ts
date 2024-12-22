import { Message } from '@/types/chat';
import { MessageLogger } from './MessageLogger';
import { toast } from 'sonner';

interface QueuedMessage {
  id: string;
  message: Message;
  attempts: number;
  timestamp: Date;
}

export class MessageQueue {
  private queue: QueuedMessage[] = [];
  private logger: MessageLogger;
  private processing = false;
  private maxRetries = 3;

  constructor(private sessionId: string) {
    this.logger = new MessageLogger(sessionId);
  }

  async enqueue(message: Message) {
    this.logger.logMessageAttempt(message);
    toast.info('Message queued for sending');

    const queuedMessage: QueuedMessage = {
      id: crypto.randomUUID(),
      message,
      attempts: 0,
      timestamp: new Date()
    };

    this.queue.push(queuedMessage);
    
    if (!this.processing) {
      await this.processQueue();
    }
  }

  private async processQueue() {
    if (this.processing || this.queue.length === 0) return;

    this.processing = true;
    toast.loading('Processing message queue...');

    while (this.queue.length > 0) {
      const item = this.queue[0];
      
      try {
        this.logger.logMessageProcessing(item.message);
        // Process message (implement actual sending logic)
        await this.sendMessage(item.message);
        
        this.queue.shift(); // Remove processed message
        this.logger.logMessageSuccess(item.message);
        toast.success('Message sent successfully');
      } catch (error) {
        this.logger.logMessageError(error as Error, item.message);
        
        if (item.attempts >= this.maxRetries) {
          this.queue.shift(); // Remove failed message after max retries
          toast.error(`Failed to send message after ${this.maxRetries} attempts`);
        } else {
          item.attempts++;
          toast.error(`Message send failed, attempt ${item.attempts}/${this.maxRetries}`);
          // Move to end of queue for retry
          this.queue.push(this.queue.shift()!);
          // Add delay before next retry
          await new Promise(resolve => setTimeout(resolve, 1000 * Math.pow(2, item.attempts)));
        }
      }
    }

    this.processing = false;
  }

  private async sendMessage(message: Message) {
    // Implement actual message sending logic here
    // This is a placeholder for the actual implementation
    await new Promise(resolve => setTimeout(resolve, 100));
  }

  getQueueLength(): number {
    return this.queue.length;
  }

  clearQueue() {
    this.logger.logMessageProcessing({ id: 'queue_clear', type: 'system' });
    this.queue = [];
    toast.success('Message queue cleared');
  }
}