
/**
 * SafeJson type that avoids recursive type definitions
 * This prevents "Type instantiation is excessively deep and possibly infinite" errors
 */
export type SafeJson =
  | string
  | number
  | boolean
  | null
  | { [key: string]: SafeJson }
  | SafeJson[];

/**
 * Type guard to check if a value is a valid SafeJson object
 */
export function isSafeJson(value: unknown): value is SafeJson {
  if (value === null) return true;
  if (typeof value === 'string' || typeof value === 'number' || typeof value === 'boolean') return true;
  
  if (Array.isArray(value)) {
    return value.every(item => isSafeJson(item));
  }
  
  if (typeof value === 'object') {
    return Object.values(value).every(item => isSafeJson(item));
  }
  
  return false;
}

/**
 * Safely convert any value to SafeJson
 * This will convert functions, symbols, undefined, etc. to null
 */
export function toSafeJson(value: unknown): SafeJson {
  if (value === undefined) return null;
  if (value === null) return null;
  if (typeof value === 'string' || typeof value === 'number' || typeof value === 'boolean') return value;
  
  if (Array.isArray(value)) {
    return value.map(item => toSafeJson(item));
  }
  
  if (typeof value === 'object') {
    const result: Record<string, SafeJson> = {};
    for (const [key, val] of Object.entries(value)) {
      result[key] = toSafeJson(val);
    }
    return result;
  }
  
  return null;
}
