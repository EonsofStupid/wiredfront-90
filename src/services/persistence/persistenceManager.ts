
import { 
  PersistenceManager,
  StorageOptions,
  StoredItem,
  StorageStats
} from './types';
import { logger } from '@/services/chat/LoggingService';

// Default options
const defaultOptions: StorageOptions = {
  type: 'local',
  prefix: 'app_',
  expiry: undefined, // No expiry by default
  encrypt: false
};

// In-memory storage for when localStorage/sessionStorage is not available
const memoryStorage = new Map<string, string>();

// Simple implementation of persistence manager
class PersistenceManagerImpl implements PersistenceManager {
  private getStorage(type: StorageOptions['type']): Storage | Map<string, string> {
    switch (type) {
      case 'local':
        return typeof window !== 'undefined' && window.localStorage ? 
          window.localStorage : memoryStorage;
      case 'session':
        return typeof window !== 'undefined' && window.sessionStorage ? 
          window.sessionStorage : memoryStorage;
      case 'memory':
      default:
        return memoryStorage;
    }
  }

  private getFullKey(key: string, prefix?: string): string {
    return `${prefix || defaultOptions.prefix}${key}`;
  }

  public getItem<T>(key: string, options?: Partial<StorageOptions>): T | null {
    const opts = { ...defaultOptions, ...options };
    const storage = this.getStorage(opts.type);
    const fullKey = this.getFullKey(key, opts.prefix);

    try {
      let storedValue: string | null;
      
      if (storage instanceof Map) {
        storedValue = storage.get(fullKey) || null;
      } else {
        storedValue = storage.getItem(fullKey);
      }

      if (!storedValue) {
        return null;
      }

      const parsedItem = JSON.parse(storedValue) as StoredItem<T>;

      // Check if item is expired
      if (parsedItem.expiry && Date.now() > parsedItem.timestamp + parsedItem.expiry) {
        this.removeItem(key, opts);
        return null;
      }

      return parsedItem.value;
    } catch (error) {
      logger.error(`Error retrieving item: ${key}`, { error });
      return null;
    }
  }

  public setItem<T>(key: string, value: T, options?: Partial<StorageOptions>): void {
    const opts = { ...defaultOptions, ...options };
    const storage = this.getStorage(opts.type);
    const fullKey = this.getFullKey(key, opts.prefix);

    try {
      const item: StoredItem<T> = {
        value,
        timestamp: Date.now(),
        expiry: opts.expiry,
        version: '1.0' // Version can be used for migrations
      };

      const serializedItem = JSON.stringify(item);
      
      if (storage instanceof Map) {
        storage.set(fullKey, serializedItem);
      } else {
        storage.setItem(fullKey, serializedItem);
      }
    } catch (error) {
      logger.error(`Error storing item: ${key}`, { error });
      
      // If we failed due to storage quota, try to clear expired items
      if (error instanceof DOMException && (
        error.name === 'QuotaExceededError' || 
        error.name === 'NS_ERROR_DOM_QUOTA_REACHED'
      )) {
        this.cleanExpiredItems(opts);
        
        // Try again
        try {
          const item: StoredItem<T> = {
            value,
            timestamp: Date.now(),
            expiry: opts.expiry,
            version: '1.0'
          };

          const serializedItem = JSON.stringify(item);
          
          if (storage instanceof Map) {
            storage.set(fullKey, serializedItem);
          } else {
            storage.setItem(fullKey, serializedItem);
          }
        } catch (retryError) {
          logger.error(`Failed to save item after cleanup: ${key}`, { error: retryError });
        }
      }
    }
  }

  public removeItem(key: string, options?: Partial<StorageOptions>): void {
    const opts = { ...defaultOptions, ...options };
    const storage = this.getStorage(opts.type);
    const fullKey = this.getFullKey(key, opts.prefix);

    try {
      if (storage instanceof Map) {
        storage.delete(fullKey);
      } else {
        storage.removeItem(fullKey);
      }
    } catch (error) {
      logger.error(`Error removing item: ${key}`, { error });
    }
  }

  public clear(options?: Partial<StorageOptions>): void {
    const opts = { ...defaultOptions, ...options };
    const storage = this.getStorage(opts.type);
    const prefix = opts.prefix || defaultOptions.prefix;

    try {
      if (storage instanceof Map) {
        // Clear only items with our prefix
        Array.from(storage.keys())
          .filter(key => key.startsWith(prefix))
          .forEach(key => storage.delete(key));
      } else {
        // Clear only items with our prefix
        const keys = Object.keys(storage)
          .filter(key => key.startsWith(prefix));
        
        keys.forEach(key => storage.removeItem(key));
      }
    } catch (error) {
      logger.error('Error clearing storage', { error, storageType: opts.type });
    }
  }

  public getKeys(options?: Partial<StorageOptions>): string[] {
    const opts = { ...defaultOptions, ...options };
    const storage = this.getStorage(opts.type);
    const prefix = opts.prefix || defaultOptions.prefix;

    try {
      if (storage instanceof Map) {
        return Array.from(storage.keys())
          .filter(key => key.startsWith(prefix))
          .map(key => key.slice(prefix.length));
      } else {
        return Object.keys(storage)
          .filter(key => key.startsWith(prefix))
          .map(key => key.slice(prefix.length));
      }
    } catch (error) {
      logger.error('Error getting keys', { error, storageType: opts.type });
      return [];
    }
  }

  public hasItem(key: string, options?: Partial<StorageOptions>): boolean {
    return this.getItem(key, options) !== null;
  }

  public getStats(options?: Partial<StorageOptions>): StorageStats {
    const opts = { ...defaultOptions, ...options };
    const storage = this.getStorage(opts.type);
    const prefix = opts.prefix || defaultOptions.prefix;

    try {
      let totalSize = 0;
      let oldestTimestamp = Infinity;
      let newestTimestamp = 0;
      let oldestKey: string | null = null;
      let newestKey: string | null = null;
      let count = 0;

      const processItem = (fullKey: string, value: string) => {
        if (fullKey.startsWith(prefix)) {
          count++;
          totalSize += value.length * 2; // Approximate size in bytes (2 bytes per char)
          
          try {
            const item = JSON.parse(value) as StoredItem<unknown>;
            if (item.timestamp < oldestTimestamp) {
              oldestTimestamp = item.timestamp;
              oldestKey = fullKey.slice(prefix.length);
            }
            if (item.timestamp > newestTimestamp) {
              newestTimestamp = item.timestamp;
              newestKey = fullKey.slice(prefix.length);
            }
          } catch (e) {
            // Skip items that can't be parsed
          }
        }
      };

      if (storage instanceof Map) {
        storage.forEach((value, key) => {
          processItem(key, value);
        });
      } else {
        for (let i = 0; i < storage.length; i++) {
          const key = storage.key(i);
          if (key) {
            const value = storage.getItem(key);
            if (value) {
              processItem(key, value);
            }
          }
        }
      }

      return {
        totalItems: count,
        totalSize,
        oldestItem: oldestKey,
        newestItem: newestKey
      };
    } catch (error) {
      logger.error('Error getting storage stats', { error, storageType: opts.type });
      return {
        totalItems: 0,
        totalSize: 0,
        oldestItem: null,
        newestItem: null
      };
    }
  }

  private cleanExpiredItems(options?: Partial<StorageOptions>): void {
    const opts = { ...defaultOptions, ...options };
    const storage = this.getStorage(opts.type);
    const prefix = opts.prefix || defaultOptions.prefix;

    try {
      const now = Date.now();
      
      const processItem = (fullKey: string, value: string) => {
        if (fullKey.startsWith(prefix)) {
          try {
            const item = JSON.parse(value) as StoredItem<unknown>;
            if (item.expiry && now > item.timestamp + item.expiry) {
              if (storage instanceof Map) {
                storage.delete(fullKey);
              } else {
                storage.removeItem(fullKey);
              }
            }
          } catch (e) {
            // Skip items that can't be parsed
          }
        }
      };

      if (storage instanceof Map) {
        storage.forEach((value, key) => {
          processItem(key, value);
        });
      } else {
        for (let i = 0; i < storage.length; i++) {
          const key = storage.key(i);
          if (key) {
            const value = storage.getItem(key);
            if (value) {
              processItem(key, value);
            }
          }
        }
      }

      logger.info('Cleaned expired items from storage', { storageType: opts.type });
    } catch (error) {
      logger.error('Error cleaning expired items', { error, storageType: opts.type });
    }
  }
}

// Export a singleton instance
export const persistenceManager: PersistenceManager = new PersistenceManagerImpl();
