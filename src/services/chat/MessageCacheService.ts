import { openDB, DBSchema, IDBPDatabase } from 'idb';
import { Message } from '@/types/chat';
import { toast } from 'sonner';

interface ChatDBSchema extends DBSchema {
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
  metrics: {
    key: string;
    value: {
      timestamp: number;
      cacheHits: number;
      cacheMisses: number;
      syncAttempts: number;
      syncSuccesses: number;
      errors: Array<{ timestamp: number; error: string }>;
    };
  };
}

export class MessageCacheService {
  private db: IDBPDatabase<ChatDBSchema> | null = null;
  private readonly DB_NAME = 'chat_history';
  private readonly STORE_NAME = 'messageCache';
  private readonly METRICS_STORE = 'metrics';
  private readonly CACHE_DURATION = 24 * 60 * 60 * 1000; // 24 hours
  private readonly MAX_CACHE_SIZE = 1000; // Maximum messages per session
  private readonly BATCH_SIZE = 50; // Number of messages to process at once
  private readonly VERSION = 2; // Database version

  constructor() {
    this.initDB().catch(error => {
      console.error('Failed to initialize MessageCache DB:', error);
      toast.error('Failed to initialize message cache');
    });
  }

  private async initDB() {
    try {
      this.db = await openDB<ChatDBSchema>(this.DB_NAME, this.VERSION, {
        upgrade: (db, oldVersion, newVersion) => {
          // Handle database upgrades
          if (oldVersion < 1) {
            const store = db.createObjectStore(this.STORE_NAME, {
              keyPath: 'sessionId'
            });
            store.createIndex('by-session', 'sessionId');
            store.createIndex('by-timestamp', 'timestamp');
            store.createIndex('by-status', 'metadata.status');
          }
          
          if (oldVersion < 2) {
            db.createObjectStore(this.METRICS_STORE, {
              keyPath: 'timestamp'
            });
          }
        }
      });
      
      console.log('MessageCache DB initialized successfully');
      this.recordMetric('initSuccess');
    } catch (error) {
      console.error('Failed to initialize MessageCache DB:', error);
      this.recordMetric('initError', error);
      throw error;
    }
  }

  private async recordMetric(type: string, error?: any) {
    if (!this.db) return;

    try {
      const timestamp = Date.now();
      const metrics = await this.db.get(this.METRICS_STORE, 'current') || {
        timestamp,
        cacheHits: 0,
        cacheMisses: 0,
        syncAttempts: 0,
        syncSuccesses: 0,
        errors: [],
      };

      switch (type) {
        case 'hit':
          metrics.cacheHits++;
          break;
        case 'miss':
          metrics.cacheMisses++;
          break;
        case 'syncAttempt':
          metrics.syncAttempts++;
          break;
        case 'syncSuccess':
          metrics.syncSuccesses++;
          break;
        case 'error':
          metrics.errors.push({ timestamp, error: error?.message || 'Unknown error' });
          break;
      }

      await this.db.put(this.METRICS_STORE, metrics);
    } catch (error) {
      console.error('Failed to record metric:', error);
    }
  }

  async cacheMessages(sessionId: string, messages: Message[]) {
    if (!this.db) await this.initDB();
    
    try {
      // Process messages in batches
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

      this.recordMetric('syncSuccess');
      console.log(`Cached ${messages.length} messages for session ${sessionId}`);
    } catch (error) {
      this.recordMetric('error', error);
      console.error('Failed to cache messages:', error);
      throw error;
    }
  }

  async getCachedMessages(sessionId: string): Promise<Message[] | null> {
    if (!this.db) await this.initDB();
    
    try {
      const cache = await this.db?.get(this.STORE_NAME, sessionId);
      
      if (!cache) {
        this.recordMetric('miss');
        return null;
      }
      
      // Check if cache is still valid
      if (Date.now() - cache.timestamp > this.CACHE_DURATION) {
        await this.invalidateCache(sessionId);
        this.recordMetric('miss');
        return null;
      }
      
      this.recordMetric('hit');
      console.log(`Retrieved ${cache.messages.length} cached messages for session ${sessionId}`);
      return cache.messages;
    } catch (error) {
      this.recordMetric('error', error);
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
      console.log(`Invalidated cache for session ${sessionId}`);
    } catch (error) {
      console.error('Failed to invalidate cache:', error);
      throw error;
    }
  }

  async clearCache(sessionId: string) {
    if (!this.db) await this.initDB();
    
    try {
      await this.db?.delete(this.STORE_NAME, sessionId);
      console.log(`Cleared cache for session ${sessionId}`);
    } catch (error) {
      console.error('Failed to clear cache:', error);
      throw error;
    }
  }

  async clearAllCache() {
    if (!this.db) await this.initDB();
    
    try {
      await this.db?.clear(this.STORE_NAME);
      console.log('Cleared all message cache');
    } catch (error) {
      console.error('Failed to clear all cache:', error);
      throw error;
    }
  }

  async getMetrics() {
    if (!this.db) await this.initDB();
    
    try {
      return await this.db?.get(this.METRICS_STORE, 'current');
    } catch (error) {
      console.error('Failed to get metrics:', error);
      return null;
    }
  }

  async optimizeCache(sessionId: string) {
    if (!this.db) await this.initDB();
    
    try {
      const cache = await this.db?.get(this.STORE_NAME, sessionId);
      if (!cache) return;

      // Remove duplicates and sort by timestamp
      const uniqueMessages = Array.from(
        new Map(cache.messages.map(msg => [msg.id, msg])).values()
      ).sort((a, b) => 
        new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
      );

      // Trim to max size
      const trimmedMessages = uniqueMessages.slice(0, this.MAX_CACHE_SIZE);

      await this.cacheMessages(sessionId, trimmedMessages);
      console.log(`Optimized cache for session ${sessionId}`);
    } catch (error) {
      console.error('Failed to optimize cache:', error);
      throw error;
    }
  }
}

export const messageCache = new MessageCacheService();