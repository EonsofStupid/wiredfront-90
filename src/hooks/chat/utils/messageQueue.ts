import { Message } from '@/types/chat';

export class MessageQueueManager {
  private queue: Message[] = [];
  private maxSize: number;

  constructor(maxSize = 100) {
    this.maxSize = maxSize;
  }

  add(message: Message): void {
    if (this.queue.length >= this.maxSize) {
      this.queue.shift(); // Remove oldest message if queue is full
    }
    this.queue.push(message);
  }

  remove(messageId: string): void {
    this.queue = this.queue.filter(msg => msg.id !== messageId);
  }

  getAll(): Message[] {
    return [...this.queue];
  }

  clear(): void {
    this.queue = [];
  }

  size(): number {
    return this.queue.length;
  }
}