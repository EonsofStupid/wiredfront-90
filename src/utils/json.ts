
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
 * Convert a Json object to a Record<string, any>
 * Use this for metadata and context fields from the database
 */
export function jsonToRecord(json: Json | null | undefined): Record<string, any> {
  if (json === null || json === undefined) {
    return {};
  }
  
  if (typeof json === 'object' && json !== null && !Array.isArray(json)) {
    return json as Record<string, any>;
  }
  
  try {
    // If it's a string, try to parse it
    if (typeof json === 'string') {
      return JSON.parse(json) as Record<string, any>;
    }
    
    // If it's not an object, return an empty object
    return {};
  } catch (e) {
    console.error('Error converting JSON to Record:', e);
    return {};
  }
}

/**
 * Create an empty record that satisfies the Json type
 */
export function emptyJsonRecord(): Record<string, Json> {
  return {};
}
