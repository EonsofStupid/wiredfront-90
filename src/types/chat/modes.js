/**
 * Chat mode types - single source of truth
 */
// Constants for chat modes (matching database)
export const CHAT_MODES = {
    CHAT: 'chat',
    DEV: 'dev',
    IMAGE: 'image',
    TRAINING: 'training',
    CODE: 'code',
    PLANNING: 'planning'
};
/**
 * Type guard for chat modes
 */
export function isChatMode(value) {
    return typeof value === 'string' && [
        'chat',
        'dev',
        'image',
        'training',
        'code',
        'planning'
    ].includes(value);
}
/**
 * Normalize legacy mode names to current ones
 */
export function normalizeChatMode(mode) {
    if (!mode)
        return 'chat';
    // Map legacy values to new expected values
    const modeMap = {
        'standard': 'chat',
        'developer': 'dev'
    };
    // If it's a valid mode, return it or its mapped value
    const normalizedMode = modeMap[mode] || mode;
    if (isChatMode(normalizedMode)) {
        return normalizedMode;
    }
    // Default fallback
    return 'chat';
}
