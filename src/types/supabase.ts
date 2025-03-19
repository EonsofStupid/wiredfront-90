
/**
 * Helper functions for Supabase JSON handling
 */

/**
 * Converts a value to a JSON string if it's an object
 * @param value The value to convert
 * @returns The stringified JSON or the original value if it's already a string or null/undefined
 */
export function toJson(value: any): string | null {
  if (value === null || value === undefined) {
    return null;
  }
  
  if (typeof value === 'string') {
    return value;
  }
  
  if (typeof value === 'object') {
    return JSON.stringify(value);
  }
  
  return String(value);
}

/**
 * Converts a JSON string to a record object
 * @param jsonValue The JSON string or object to convert
 * @returns The parsed object or an empty object if parsing fails
 */
export function jsonToRecord<T = any>(jsonValue: any): Record<string, T> {
  if (typeof jsonValue === 'string') {
    try {
      return JSON.parse(jsonValue);
    } catch (e) {
      console.error('Failed to parse JSON string:', e);
      return {};
    }
  }
  
  if (jsonValue && typeof jsonValue === 'object') {
    return jsonValue as Record<string, T>;
  }
  
  return {};
}
