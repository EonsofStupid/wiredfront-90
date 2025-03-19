
/**
 * Central export file for all chat-related types
 */

// Re-export all type modules
export * from './core';
export * from './database';
export * from './ui';
export * from './store';

// Additional helper types
export type ConnectionState = 'connected' | 'connecting' | 'disconnected' | 'error';

/**
 * Helper for converting JSON to TypeScript records
 */
export function convertJsonToRecord<T = any>(jsonValue: any): Record<string, T> {
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
