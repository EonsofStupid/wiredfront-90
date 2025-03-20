/**
 * Type guard to check if a value is a valid TokenEnforcementMode
 */
export function isTokenEnforcementMode(value) {
    return [
        'hard',
        'soft',
        'never',
        'always',
        'role_based',
        'mode_based'
    ].includes(value);
}
/**
 * Convert a potential token enforcement mode string to a valid mode or default
 */
export function normalizeTokenEnforcementMode(mode, defaultMode = 'never') {
    if (!mode)
        return defaultMode;
    return isTokenEnforcementMode(mode) ? mode : defaultMode;
}
/**
 * Map token enforcement mode to display name
 */
export function getTokenEnforcementModeDisplayName(mode) {
    const modeMap = {
        'hard': 'Strict Enforcement',
        'soft': 'Warning Only',
        'never': 'Disabled',
        'always': 'Always Enabled',
        'role_based': 'Role-Based',
        'mode_based': 'Mode-Based'
    };
    return modeMap[mode] || 'Unknown';
}
/**
 * Convert between chat store TokenControl enforcementMode and TokenEnforcementMode enum
 * This helps unify the types across the application
 */
export function mapTokenEnforcementMode(mode) {
    if (isTokenEnforcementMode(mode)) {
        return mode;
    }
    // Handle possible string conversions
    if (typeof mode === 'string') {
        if (isTokenEnforcementMode(mode)) {
            return mode;
        }
        // Try some common conversions
        const normalized = mode.toLowerCase().replace(/[_\s]/g, '_');
        if (isTokenEnforcementMode(normalized)) {
            return normalized;
        }
    }
    // Default fallback
    return 'never';
}
