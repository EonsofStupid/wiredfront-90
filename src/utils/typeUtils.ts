
/**
 * Type utilities for safely converting database query results to application types
 */

import { PostgrestError } from "@supabase/supabase-js";
import { Database } from "@/integrations/supabase/types";
import { LogLevel, LogSource } from "@/integrations/supabase/types/enums";

/**
 * Type guard to check if a Supabase query resulted in an error
 */
export function isQueryError(result: any): result is { error: PostgrestError } {
  return result && 'error' in result && result.error !== null;
}

/**
 * Type guard to check if value is a non-null object
 */
export function isObject(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null;
}

/**
 * Safely transforms Supabase query results to application types with proper type checking
 * @param data The data from a Supabase query
 * @param validator An optional validation function to ensure the data matches expected shape
 * @returns The transformed data with proper types or an empty array if invalid
 */
export function safeDataTransform<T>(
  data: unknown,
  validator?: (item: unknown) => boolean
): T[] {
  if (!Array.isArray(data)) {
    console.warn('Expected array data in transform but received:', typeof data);
    return [];
  }

  // If no validator is provided, just cast and return
  if (!validator) {
    return data as T[];
  }

  // Filter out any items that don't pass validation
  return data.filter(validator) as T[];
}

/**
 * Validates that an object has the required keys of type T
 * @param item The item to check
 * @param requiredKeys Array of keys that must exist on the object
 * @returns Whether the item has all required keys
 */
export function hasRequiredKeys<T>(
  item: unknown,
  requiredKeys: (keyof T)[]
): item is T {
  if (!isObject(item)) return false;
  return requiredKeys.every(key => key in item);
}

/**
 * Type guard for system log entries
 */
export function isSystemLog(item: unknown): item is SystemLog {
  if (!isObject(item)) return false;
  
  const hasRequired = hasRequiredKeys<SystemLog>(item, [
    'id', 'timestamp', 'level', 'source', 'message'
  ]);
  
  if (!hasRequired) return false;
  
  // Additional validation for level and source if needed
  const log = item as SystemLog;
  return typeof log.message === 'string' && 
         typeof log.level === 'string' && 
         typeof log.source === 'string';
}

/**
 * Type guard for navigation log entries
 */
export function isNavigationLog(item: unknown): item is NavigationLog {
  if (!isObject(item)) return false;
  
  return hasRequiredKeys<NavigationLog>(item, [
    'id', 'timestamp', 'message', 'metadata'
  ]);
}

/**
 * SystemLog interface matching the database schema
 */
export interface SystemLog {
  id: string;
  timestamp: string;
  level: LogLevel | string;
  source: LogSource | string;
  message: string;
  metadata: any | null;
  user_id?: string | null;
}

/**
 * NavigationLog interface
 */
export interface NavigationLog {
  id: string;
  timestamp: string;
  message: string;
  metadata: {
    from?: string;
    to?: string;
    previousRoute?: string;
    currentRoute?: string;
    [key: string]: any;
  };
  user_id?: string | null;
}
