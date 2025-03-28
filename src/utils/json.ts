
/**
 * Utilities for handling JSON safely in the application
 */
import { Json } from '@/integrations/supabase/types';
import { logger } from '@/services/chat/LoggingService';

/**
 * Safely convert any value to a Json type
 * This helps with type consistency when working with Supabase
 */
export function toJson<T>(value: T): Json {
  if (value === undefined || value === null) {
    return null;
  }
  
  try {
    if (typeof value === 'object') {
      return JSON.parse(JSON.stringify(value)) as Json;
    }
    
    return value as Json;
  } catch (error) {
    logger.error('Error converting to JSON:', error);
    return null;
  }
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
    if (typeof json === 'string' && (json.startsWith('{') || json.startsWith('['))) {
      return JSON.parse(json) as T;
    }
    return json as unknown as T;
  } catch (error) {
    logger.error('Error parsing JSON:', error);
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
  } catch (error) {
    logger.error('Error converting JSON to Record:', error);
    return {};
  }
}

/**
 * Create an empty record that satisfies the Json type
 */
export function emptyJsonRecord(): Record<string, Json> {
  return {};
}

/**
 * Safely merge two JSON objects
 */
export function mergeJsonObjects(obj1: Json | null | undefined, obj2: Json | null | undefined): Record<string, any> {
  const record1 = jsonToRecord(obj1);
  const record2 = jsonToRecord(obj2);
  
  return { ...record1, ...record2 };
}

/**
 * Safely access a property from a JSON object
 */
export function getJsonProperty<T>(json: Json | null | undefined, key: string, defaultValue?: T): T | undefined {
  const record = jsonToRecord(json);
  
  if (key in record) {
    return record[key] as T;
  }
  
  return defaultValue;
}
