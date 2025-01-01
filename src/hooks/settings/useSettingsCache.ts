import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

interface CachedSetting {
  value: string;
  lastUpdated: number;
}

const CACHE_TTL = 3600000; // 1 hour in milliseconds

export function useSettingsCache() {
  const [cache, setCache] = useState<Record<string, CachedSetting>>({});

  const getCachedValue = (settingId: string): string | null => {
    const cached = cache[settingId];
    if (!cached) return null;
    
    const now = Date.now();
    if (now - cached.lastUpdated > CACHE_TTL) {
      // Cache expired
      const newCache = { ...cache };
      delete newCache[settingId];
      setCache(newCache);
      return null;
    }
    
    return cached.value;
  };

  const setCachedValue = (settingId: string, value: string) => {
    setCache(prev => ({
      ...prev,
      [settingId]: {
        value,
        lastUpdated: Date.now()
      }
    }));
  };

  const invalidateCache = (settingId?: string) => {
    if (settingId) {
      setCache(prev => {
        const newCache = { ...prev };
        delete newCache[settingId];
        return newCache;
      });
    } else {
      setCache({});
    }
  };

  return {
    getCachedValue,
    setCachedValue,
    invalidateCache
  };
}