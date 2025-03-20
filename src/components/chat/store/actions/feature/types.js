/**
 * Converts a feature key to a chat feature key with proper type narrowing and null handling
 */
export function convertFeatureKeyToChatFeature(key) {
    // Guard against null or undefined
    if (key === null || key === undefined) {
        return null;
    }
    // If it's already a keyof FeatureState, return it directly
    if (isFeatureStateKey(key)) {
        return key;
    }
    // Handle string mappings safely
    if (typeof key === 'string') {
        return mapStringToFeatureKey(key);
    }
    // Default case - return null for unhandled types
    return null;
}
// Type guard to check if a key is a valid FeatureState key
export function isFeatureStateKey(key) {
    if (key === null || key === undefined) {
        return false;
    }
    const validKeys = [
        'voice',
        'rag',
        'modeSwitch',
        'notifications',
        'github',
        'codeAssistant',
        'ragSupport',
        'githubSync',
        'tokenEnforcement',
        'startMinimized',
        'showTimestamps',
        'saveHistory'
    ];
    return validKeys.includes(key);
}
// Helper function to convert string feature keys
function mapStringToFeatureKey(key) {
    const featureKeyMap = {
        'code_assistant': 'codeAssistant',
        'rag_support': 'ragSupport',
        'github_sync': 'githubSync',
        'notifications': 'notifications',
        'voice': 'voice',
        'rag': 'rag',
        'mode_switch': 'modeSwitch',
        'github': 'github',
        'token_enforcement': 'tokenEnforcement',
        'start_minimized': 'startMinimized',
        'show_timestamps': 'showTimestamps',
        'save_history': 'saveHistory'
    };
    return featureKeyMap[key] || null;
}
