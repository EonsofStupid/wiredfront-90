import { isChatMode } from '@/types/chat';
// Define custom type guards for our enum types
export const isLogLevel = (value) => {
    return ['info', 'error', 'warn', 'debug'].includes(value);
};
export const isLogSource = (value) => {
    return typeof value === 'string';
};
export const isTokenEnforcementMode = (value) => {
    return ['hard', 'soft', 'never', 'always', 'role_based', 'mode_based'].includes(value);
};
// Add helper function to convert between different ChatMode naming conventions
export const normalizeChatMode = (mode) => {
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
};
// Helper for converting between feature flag representations
export const mapFeatureFlagToChat = (flagKey) => {
    const mapping = {
        'voice_input': 'voice',
        'mode_switch': 'modeSwitch',
        'github_integration': 'github',
        'code_assistant': 'codeAssistant',
        'rag_support': 'ragSupport',
        'github_sync': 'githubSync',
        'token_enforcement': 'tokenEnforcement',
        'token_control': 'tokenEnforcement'
    };
    return mapping[flagKey] || flagKey;
};
