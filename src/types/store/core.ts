// Core type definitions for store management
export type Status = 'idle' | 'loading' | 'error' | 'success';

export interface AsyncState {
  status: Status;
  error: string | null;
  timestamp: number | null;
}

export interface BaseState {
  version: string;
  initialized: boolean;
}

// Redis configuration types
export interface RedisConfig {
  host: string;
  port: number;
  password?: string;
  tls?: boolean;
  database?: number;
  prefix?: string;
}

export interface CacheConfig extends RedisConfig {
  ttl: number;
  maxSize: number;
  invalidationStrategy: 'lru' | 'fifo' | 'custom';
}

// Store configuration types
export interface StoreConfig {
  persist?: boolean;
  storage?: 'local' | 'session' | 'redis';
  encryption?: boolean;
  version?: string;
}

// Validation types
export interface ValidationResult {
  valid: boolean;
  errors: ValidationError[];
}

export interface ValidationError {
  field: string;
  message: string;
  code: string;
}

// Type guards
export const isAsyncState = (state: unknown): state is AsyncState => {
  return (
    typeof state === 'object' &&
    state !== null &&
    'status' in state &&
    'error' in state &&
    'timestamp' in state
  );
};

export const isRedisConfig = (config: unknown): config is RedisConfig => {
  return (
    typeof config === 'object' &&
    config !== null &&
    'host' in config &&
    'port' in config &&
    typeof (config as RedisConfig).host === 'string' &&
    typeof (config as RedisConfig).port === 'number'
  );
};