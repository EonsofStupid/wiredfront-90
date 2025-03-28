
/**
 * Utilities for handling JSON safely in the application
 */
import { Json } from '@/integrations/supabase/types';

/**
 * Safely convert any value to a Json type
 * This helps with type consistency when working with Supabase
 */
export function toJson<T>(value: T): Json {
  if (value === undefined || value === null) {
    return null;
  }
  
  if (typeof value === 'object') {
    return JSON.parse(JSON.stringify(value)) as Json;
  }
  
  return value as Json;
}

/**
 * Parse a Json value to a specific type
 * Use this when retrieving data from Supabase
 */
export function fromJson<T>(json: Json | null | undefined, defaultValue?: T): T | undefined {
  if (json === null || json === undefined) {
    return defaultValue;
  }
  
  try {
    return json as unknown as T;
  } catch (e) {
    console.error('Error parsing JSON:', e);
    return defaultValue;
  }
}

/**
 * Create an empty record that satisfies the Json type
 */
export function emptyJsonRecord(): Record<string, Json> {
  return {};
}
