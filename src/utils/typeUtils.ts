
import { PostgrestError } from '@supabase/supabase-js';

export interface SystemLog {
  id: string;
  timestamp: string;
  level: string;
  source: string;
  message: string;
  metadata?: Record<string, any> | null;
  user_id?: string | null;
}

export interface NavigationLog extends SystemLog {
  metadata: {
    from: string;
    to: string;
    timestamp: string;
    [key: string]: any;
  };
}

export interface QueryErrorResult {
  error: PostgrestError;
}

export interface QuerySuccessResult<T> {
  data: T[] | null;
}

// Type guard to check if a response is a SystemLog
export function isSystemLog(obj: any): obj is SystemLog {
  return (
    typeof obj === 'object' &&
    obj !== null &&
    typeof obj.id === 'string' &&
    typeof obj.timestamp === 'string' &&
    typeof obj.level === 'string' &&
    typeof obj.source === 'string' &&
    typeof obj.message === 'string'
  );
}

// Type guard to check if a response is a NavigationLog
export function isNavigationLog(obj: any): obj is NavigationLog {
  return (
    isSystemLog(obj) &&
    obj.source === 'navigation' &&
    typeof obj.metadata === 'object' &&
    obj.metadata !== null &&
    typeof obj.metadata.from === 'string' &&
    typeof obj.metadata.to === 'string' &&
    typeof obj.metadata.timestamp === 'string'
  );
}

// Type guard to check if a Supabase response is an error
export function isQueryError(result: any): result is QueryErrorResult {
  return result && result.error instanceof Object;
}

// Type guard to check if a Supabase response is successful
export function isQuerySuccess<T>(result: any): result is QuerySuccessResult<T> {
  return result && Array.isArray(result.data);
}

// Safely transform data with type checking
export function safeDataTransform<T>(data: any[], typeGuard: (item: any) => item is T): T[] {
  if (!Array.isArray(data)) return [];
  
  return data.filter(typeGuard);
}

// Safely get array data from a response that might be null
export function safeArrayAccess<T>(data: T[] | null | undefined): T[] {
  if (!data) return [];
  if (!Array.isArray(data)) return [];
  return data;
}

// Safely parse JSON with fallback
export function safeJsonParse<T>(jsonString: string | null, fallback: T): T {
  if (!jsonString) return fallback;
  try {
    return JSON.parse(jsonString) as T;
  } catch (e) {
    console.error('Failed to parse JSON:', e);
    return fallback;
  }
}

// Safely extract data from a Supabase response
export function safeExtractData<T>(response: { data: T | null; error: PostgrestError | null }): T | null {
  if (response?.error) {
    console.error('Error in Supabase response:', response.error);
    return null;
  }
  return response?.data || null;
}
