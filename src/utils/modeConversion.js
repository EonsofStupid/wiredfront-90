import { isChatMode } from '@/types/chat/core';
/**
 * Convert a Supabase mode to a store-compatible mode
 */
export function supabaseModeToStoreMode(mode) {
    // Map database mode values to store mode values
    const modeMap = {
        'standard': 'chat',
        'developer': 'dev'
    };
    // If it's already a valid mode, return it or its mapped value
    if (isChatMode(mode)) {
        return mode;
    }
    // Check if there's a mapping
    if (mode in modeMap) {
        return modeMap[mode];
    }
    // Default fallback
    return 'chat';
}
/**
 * Convert a store mode to a Supabase-compatible mode
 */
export function storeModeToSupabaseMode(mode) {
    // Map store mode values to database mode values
    const modeMap = {
        'chat': 'chat',
        'dev': 'dev',
        'image': 'image',
        'training': 'training',
        'code': 'code',
        'planning': 'planning'
    };
    return modeMap[mode] || 'chat';
}
