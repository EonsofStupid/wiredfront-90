import { CacheSettings } from "@/types/admin/settings/types";

export interface CacheState {
  settings: CacheSettings;
  isEnabled: boolean;
  maxSize: number;
  ttl: number;
}

export interface CacheActions {
  updateSettings: (settings: Partial<CacheSettings>) => void;
  clearCache: () => void;
  resetSettings: () => void;
}

export type CacheStore = CacheState & CacheActions;