import { openDB, DBSchema, IDBPDatabase } from 'idb';
import { Message } from '@/types/chat';

interface ChatDBSchema extends DBSchema {
  messageCache: {
    key: string;
    value: {
      messages: Message[];
      timestamp: number;
      sessionId: string;
    };
    indexes: { 'by-session': string };
  };
}

export class MessageCacheService {
  private db: IDBPDatabase<ChatDBSchema> | null = null;
  private readonly DB_NAME = 'chat_history';
  private readonly STORE_NAME = 'messageCache';
  private readonly CACHE_DURATION = 24 * 60 * 60 * 1000; // 24 hours

  constructor() {
    this.initDB();
  }

  private async initDB() {
    try {
      this.db = await openDB<ChatDBSchema>(this.DB_NAME, 1, {
        upgrade(db) {
          const store = db.createObjectStore('messageCache', {
            keyPath: 'sessionId'
          });
          store.createIndex('by-session', 'sessionId');
        }
      });
      console.log('MessageCache DB initialized');
    } catch (error) {
      console.error('Failed to initialize MessageCache DB:', error);
    }
  }

  async cacheMessages(sessionId: string, messages: Message[]) {
    if (!this.db) await this.initDB();
    
    try {
      await this.db?.put(this.STORE_NAME, {
        sessionId,
        messages,
        timestamp: Date.now()
      });
      console.log(`Cached ${messages.length} messages for session ${sessionId}`);
    } catch (error) {
      console.error('Failed to cache messages:', error);
    }
  }

  async getCachedMessages(sessionId: string): Promise<Message[] | null> {
    if (!this.db) await this.initDB();
    
    try {
      const cache = await this.db?.get(this.STORE_NAME, sessionId);
      
      if (!cache) return null;
      
      // Check if cache is still valid
      if (Date.now() - cache.timestamp > this.CACHE_DURATION) {
        await this.clearCache(sessionId);
        return null;
      }
      
      console.log(`Retrieved ${cache.messages.length} cached messages for session ${sessionId}`);
      return cache.messages;
    } catch (error) {
      console.error('Failed to retrieve cached messages:', error);
      return null;
    }
  }

  async clearCache(sessionId: string) {
    if (!this.db) await this.initDB();
    
    try {
      await this.db?.delete(this.STORE_NAME, sessionId);
      console.log(`Cleared cache for session ${sessionId}`);
    } catch (error) {
      console.error('Failed to clear cache:', error);
    }
  }

  async clearAllCache() {
    if (!this.db) await this.initDB();
    
    try {
      await this.db?.clear(this.STORE_NAME);
      console.log('Cleared all message cache');
    } catch (error) {
      console.error('Failed to clear all cache:', error);
    }
  }
}

export const messageCache = new MessageCacheService();