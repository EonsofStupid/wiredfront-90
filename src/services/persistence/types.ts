
export type StorageType = 'local' | 'session' | 'memory';

export interface StorageOptions {
  type: StorageType;
  prefix?: string;
  expiry?: number; // Expiry in milliseconds
  encrypt?: boolean;
}

export interface StoredItem<T> {
  value: T;
  timestamp: number;
  expiry?: number;
  version?: string;
}

export interface StorageStats {
  totalItems: number;
  totalSize: number;
  oldestItem: string | null;
  newestItem: string | null;
}

export interface PersistenceManager {
  getItem: <T>(key: string, options?: Partial<StorageOptions>) => T | null;
  setItem: <T>(key: string, value: T, options?: Partial<StorageOptions>) => void;
  removeItem: (key: string, options?: Partial<StorageOptions>) => void;
  clear: (options?: Partial<StorageOptions>) => void;
  getKeys: (options?: Partial<StorageOptions>) => string[];
  hasItem: (key: string, options?: Partial<StorageOptions>) => boolean;
  getStats: (options?: Partial<StorageOptions>) => StorageStats;
}
