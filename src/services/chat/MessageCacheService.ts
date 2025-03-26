import { Message } from '@/components/chat/shared/schemas/messages';
import { logger } from './LoggingService';

interface CacheEntry {
  message: Message;
  timestamp: number;
}

class MessageCacheService {
  private cache: Map<string, CacheEntry>;
  private maxCacheSize: number;
  private cacheDuration: number;

  constructor(maxSize: number = 500, duration: number = 60 * 60 * 1000) {
    this.cache = new Map();
    this.maxCacheSize = maxSize;
    this.cacheDuration = duration;
  }

  /**
   * Adds a message to the cache.
   * @param message The message to cache.
   */
  public cacheMessage(message: Message): void {
    if (this.cache.size >= this.maxCacheSize) {
      this.removeOldestEntry();
    }

    this.cache.set(message.id, { message, timestamp: Date.now() });
    logger.debug('Cached message', { messageId: message.id });
  }

  /**
   * Retrieves a message from the cache.
   * @param messageId The ID of the message to retrieve.
   * @returns The cached message, or null if not found or expired.
   */
  public getMessage(messageId: string): Message | null {
    const entry = this.cache.get(messageId);

    if (!entry) {
      return null;
    }

    if (Date.now() - entry.timestamp > this.cacheDuration) {
      this.cache.delete(messageId);
      logger.debug('Cache entry expired', { messageId });
      return null;
    }

    logger.debug('Retrieved message from cache', { messageId });
    return entry.message;
  }

  /**
   * Removes a message from the cache.
   * @param messageId The ID of the message to remove.
   */
  public removeMessage(messageId: string): void {
    if (this.cache.delete(messageId)) {
      logger.debug('Removed message from cache', { messageId });
    }
  }

  /**
   * Clears the entire cache.
   */
  public clearAllCache(): void {
    this.cache.clear();
    logger.info('Cleared all message cache');
  }

  /**
   * Returns the current size of the cache.
   * @returns The number of messages currently in the cache.
   */
  public getCacheSize(): number {
    return this.cache.size;
  }

  /**
   * Removes the oldest entry from the cache to maintain the cache size.
   */
  private removeOldestEntry(): void {
    let oldestKey: string | null = null;
    let oldestTimestamp: number = Date.now();

    this.cache.forEach((entry, key) => {
      if (entry.timestamp < oldestTimestamp) {
        oldestTimestamp = entry.timestamp;
        oldestKey = key;
      }
    });

    if (oldestKey) {
      this.cache.delete(oldestKey);
      logger.debug('Removed oldest entry from cache', { messageId: oldestKey });
    }
  }
}

export const messageCache = new MessageCacheService();
