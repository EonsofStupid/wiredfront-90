import type { AsyncState } from './core/types';
import type { RedisConfig } from './settings/types';

export interface CacheState extends AsyncState {
  config: {
    ttl: number;
    maxSize: number;
    enabled: boolean;
    redis?: RedisConfig;
  };
  size: number;
  lastCleared: number | null;
}

export interface CacheActions {
  updateConfig: (config: Partial<CacheState['config']>) => void;
  clearCache: () => void;
  invalidateKey: (key: string) => void;
}

export type CacheStore = CacheState & CacheActions;