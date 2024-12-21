import { openDB, DBSchema, IDBPDatabase } from 'idb';
import { Message } from '@/types/chat';
import { cacheMetrics } from './CacheMetricsService';

interface CacheDBSchema extends DBSchema {
  messageCache: {
    key: string;
    value: {
      messages: Message[];
      timestamp: number;
      sessionId: string;
      metadata: {
        lastSync: number;
        version: number;
        size: number;
        status: 'valid' | 'stale' | 'invalid';
      };
    };
    indexes: { 
      'by-session': string;
      'by-timestamp': number;
      'by-status': string;
    };
  };
}

class CacheStorageService {
  private db: IDBPDatabase<CacheDBSchema> | null = null;
  private readonly DB_NAME = 'chat_cache';
  private readonly STORE_NAME = 'messageCache';
  private readonly CACHE_DURATION = 24 * 60 * 60 * 1000; // 24 hours
  private readonly MAX_CACHE_SIZE = 1000;
  private readonly BATCH_SIZE = 50;
  private readonly VERSION = 2;

  constructor() {
    this.initDB().catch(console.error);
  }

  private async initDB() {
    try {
      this.db = await openDB<CacheDBSchema>(this.DB_NAME, this.VERSION, {
        upgrade(db, oldVersion, newVersion) {
          if (oldVersion < 1) {
            const store = db.createObjectStore('messageCache', {
              keyPath: 'sessionId'
            });
            store.createIndex('by-session', 'sessionId');
            store.createIndex('by-timestamp', 'timestamp');
            store.createIndex('by-status', 'metadata.status');
          }
        }
      });
      console.log('Cache Storage DB initialized successfully');
    } catch (error) {
      console.error('Failed to initialize Cache Storage DB:', error);
      throw error;
    }
  }

  async cacheMessages(sessionId: string, messages: Message[]) {
    if (!this.db) await this.initDB();
    
    try {
      cacheMetrics.recordMetric('syncAttempt');
      
      for (let i = 0; i < messages.length; i += this.BATCH_SIZE) {
        const batch = messages.slice(i, i + this.BATCH_SIZE);
        const existingCache = await this.db?.get(this.STORE_NAME, sessionId);
        
        const newCache = {
          sessionId,
          messages: existingCache 
            ? [...batch, ...existingCache.messages].slice(0, this.MAX_CACHE_SIZE)
            : batch,
          timestamp: Date.now(),
          metadata: {
            lastSync: Date.now(),
            version: this.VERSION,
            size: batch.length,
            status: 'valid' as const
          }
        };

        await this.db?.put(this.STORE_NAME, newCache);
      }

      cacheMetrics.recordMetric('syncSuccess');
      console.log(`Cached ${messages.length} messages for session ${sessionId}`);
    } catch (error) {
      cacheMetrics.recordMetric('error', error);
      console.error('Failed to cache messages:', error);
      throw error;
    }
  }

  async getCachedMessages(sessionId: string): Promise<Message[] | null> {
    if (!this.db) await this.initDB();
    
    try {
      const cache = await this.db?.get(this.STORE_NAME, sessionId);
      
      if (!cache) {
        cacheMetrics.recordMetric('miss');
        return null;
      }
      
      if (Date.now() - cache.timestamp > this.CACHE_DURATION) {
        await this.invalidateCache(sessionId);
        cacheMetrics.recordMetric('miss');
        return null;
      }
      
      cacheMetrics.recordMetric('hit');
      return cache.messages;
    } catch (error) {
      cacheMetrics.recordMetric('error', error);
      console.error('Failed to retrieve cached messages:', error);
      return null;
    }
  }

  async invalidateCache(sessionId: string) {
    if (!this.db) await this.initDB();
    
    try {
      const cache = await this.db?.get(this.STORE_NAME, sessionId);
      if (cache) {
        cache.metadata.status = 'stale';
        await this.db?.put(this.STORE_NAME, cache);
      }
    } catch (error) {
      console.error('Failed to invalidate cache:', error);
      throw error;
    }
  }

  async clearCache(sessionId: string) {
    if (!this.db) await this.initDB();
    await this.db?.delete(this.STORE_NAME, sessionId);
  }

  async clearAllCache() {
    if (!this.db) await this.initDB();
    await this.db?.clear(this.STORE_NAME);
  }

  async optimizeCache(sessionId: string) {
    if (!this.db) await this.initDB();
    
    try {
      const cache = await this.db?.get(this.STORE_NAME, sessionId);
      if (!cache) return;

      const uniqueMessages = Array.from(
        new Map(cache.messages.map(msg => [msg.id, msg])).values()
      ).sort((a, b) => 
        new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
      );

      const trimmedMessages = uniqueMessages.slice(0, this.MAX_CACHE_SIZE);
      await this.cacheMessages(sessionId, trimmedMessages);
    } catch (error) {
      console.error('Failed to optimize cache:', error);
      throw error;
    }
  }
}

export const cacheStorage = new CacheStorageService();