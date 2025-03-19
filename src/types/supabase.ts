
/**
 * Supabase-specific types
 */

// Json type from Supabase
export type Json = string | number | boolean | null | { [key: string]: Json } | Json[];

// Helper type for Supabase schema columns
export type SupabaseSchemaType<T> = {
  [K in keyof T]: T[K] extends Json ? T[K] : never;
};

// JSON conversion utilities
export function jsonToRecord<T = any>(json: Json | null | undefined): Record<string, T> {
  if (!json) return {};
  
  if (typeof json === 'object' && json !== null && !Array.isArray(json)) {
    return json as Record<string, T>;
  }
  
  if (typeof json === 'string') {
    try {
      const parsed = JSON.parse(json);
      if (typeof parsed === 'object' && parsed !== null && !Array.isArray(parsed)) {
        return parsed as Record<string, T>;
      }
    } catch (e) {
      console.error('Failed to parse JSON string:', e);
    }
  }
  
  return {};
}

// Convert any value to a Json-compatible value
export function toJson(value: any): Json {
  if (value === undefined) return null;
  
  if (value === null || 
      typeof value === 'string' || 
      typeof value === 'number' || 
      typeof value === 'boolean') {
    return value;
  }
  
  if (typeof value === 'object') {
    if (Array.isArray(value)) {
      return value.map(toJson);
    }
    
    const result: Record<string, Json> = {};
    for (const key in value) {
      if (Object.prototype.hasOwnProperty.call(value, key)) {
        result[key] = toJson(value[key]);
      }
    }
    return result;
  }
  
  // Convert to string as fallback
  return String(value);
}
