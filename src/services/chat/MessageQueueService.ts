import { openDB, DBSchema, IDBPDatabase } from 'idb';
import { Message } from '@/types/chat';

interface ChatDBSchema extends DBSchema {
  messages: {
    key: string;
    value: {
      id: string;
      message: Message;
      status: 'queued' | 'sending' | 'delivered' | 'failed';
      attempts: number;
      timestamp: number;
    };
    indexes: { 'by-status': string };
  };
}

export class MessageQueueService {
  private db: IDBPDatabase<ChatDBSchema> | null = null;
  private readonly DB_NAME = 'chat_queue';
  private readonly STORE_NAME = 'messages';
  private readonly MAX_RETRIES = 3;

  constructor() {
    this.initDB();
  }

  private async initDB() {
    try {
      this.db = await openDB<ChatDBSchema>(this.DB_NAME, 1, {
        upgrade(db) {
          const store = db.createObjectStore('messages', {
            keyPath: 'id'
          });
          store.createIndex('by-status', 'status');
        }
      });
    } catch (error) {
      console.error('Failed to initialize IndexedDB:', error);
    }
  }

  async enqueue(message: Message) {
    if (!this.db) await this.initDB();
    
    const queueItem = {
      id: crypto.randomUUID(),
      message,
      status: 'queued' as const,
      attempts: 0,
      timestamp: Date.now()
    };

    await this.db?.add(this.STORE_NAME, queueItem);
    return queueItem;
  }

  async updateStatus(id: string, status: 'queued' | 'sending' | 'delivered' | 'failed') {
    if (!this.db) await this.initDB();
    
    const tx = this.db?.transaction(this.STORE_NAME, 'readwrite');
    const store = tx?.objectStore(this.STORE_NAME);
    const item = await store?.get(id);
    
    if (item) {
      const updatedItem = {
        ...item,
        status,
        attempts: status === 'failed' ? item.attempts + 1 : item.attempts
      };
      await store?.put(updatedItem);
    }
  }

  async getPendingMessages() {
    if (!this.db) await this.initDB();
    
    const tx = this.db?.transaction(this.STORE_NAME, 'readonly');
    const index = tx?.store.index('by-status');
    return await index?.getAll('queued') || [];
  }

  async getFailedMessages() {
    if (!this.db) await this.initDB();
    
    const tx = this.db?.transaction(this.STORE_NAME, 'readonly');
    const index = tx?.store.index('by-status');
    const failed = await index?.getAll('failed') || [];
    return failed.filter(msg => msg.attempts < this.MAX_RETRIES);
  }

  async removeMessage(id: string) {
    if (!this.db) await this.initDB();
    await this.db?.delete(this.STORE_NAME, id);
  }

  async clear() {
    if (!this.db) await this.initDB();
    await this.db?.clear(this.STORE_NAME);
  }
}

export const messageQueue = new MessageQueueService();