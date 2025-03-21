
/**
 * Central export file for all chat-related types
 */

// Core types
export * from './core';
export * from './messages';
export * from './sessions';
export * from './ui';
export * from './layout';
export * from './docking';
export * from './store';
export * from './database';

// Helper functions
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
