export type Status = 'idle' | 'loading' | 'error' | 'success';

export interface AsyncState {
  status: Status;
  error: string | null;
  lastUpdated: number | null;
  version: string;
}

export interface BaseState {
  version: string;
  initialized: boolean;
}

export interface CacheConfig {
  ttl: number;
  maxSize: number;
  enabled: boolean;
}

export interface RedisConfig {
  host: string;
  port: number;
  tls: boolean;
  database: number;
}

export interface ValidationResult {
  valid: boolean;
  errors: ValidationError[];
}

export interface ValidationError {
  field: string;
  message: string;
}

export interface DevToolsConfig {
  name?: string;
  enabled?: boolean;
}

export type ActionType = string;

export interface Action<T extends ActionType = ActionType, P = unknown> {
  type: T;
  payload?: P;
}