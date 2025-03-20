/**
 * Central export file for all chat-related types
 */
// Re-export all type modules
export * from './core';
export * from './database';
export * from './ui';
export * from './store';
export * from './messages';
export * from './modes';
export * from './sessions';
export * from './preferences';
export * from './layout';
export * from './docking';
/**
 * Helper for converting JSON to TypeScript records
 */
export function convertJsonToRecord(jsonValue) {
    if (typeof jsonValue === 'string') {
        try {
            return JSON.parse(jsonValue);
        }
        catch (e) {
            console.error('Failed to parse JSON string:', e);
            return {};
        }
    }
    if (jsonValue && typeof jsonValue === 'object') {
        return jsonValue;
    }
    return {};
}
